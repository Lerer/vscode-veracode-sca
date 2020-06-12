import * as vscode from 'vscode';
import {runAgentBasedSCA} from '../veracode/localSCAProcessor';
import * as path from 'path';
import {getSeverityRatingFromCVSS} from '../veracode/constants';


interface SCALocalLibraryElement {
    id: string,
    name: string,
    label: string,
    description: string,
    language: string,
    coordinateType: string,
    coordinate1: string,
    coordinate2: string,
    versions: [string]
    details?:any
    type: string,
    parent?: undefined|null|SCALocalLibraryElement
}

interface SCALocalVulnerabiltyElementDetails {
    cve: string|undefined,
    liberaries: SCALocalLibraryElement[],
    cvssScore: number,
    versionRange: string,
    updateToVersion: string
}

interface SCALocalVulnerabiltyElement {
    id: string,
    details?: SCALocalVulnerabiltyElementDetails,
    type: string,
    name: string,
    description: string,
    label: string,
    parent?: undefined|null|SCALocalVulnerabiltyElement
}

interface SCALibraryStructure {
    id: string
    parent: string|undefined
    library: SCALocalLibraryElement
}

const libIdRegEx:RegExp = /\/records\/0\/libraries\/([\d]+)\/versions\/0/i;

export class SCALocalViewProvider  implements vscode.TreeDataProvider<SCALocalVulnerabiltyElement>{

    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

    // clean the tree view from anything
    public clean() {
        localScanResult = {};
        this._onDidChangeTreeData.fire(undefined);
    }

    public callForRefresh() {
        runAgentBasedSCA('localProject.inputContent');
        libraries = [];
    }

    // refresh the view with a given content as a json result from the local scan
    public refreshLocalView(scanResultsJson? : any) {
        if (scanResultsJson===undefined){
            throw new Error("Not yet implemented");
        }
        if (scanResultsJson.records !== undefined && scanResultsJson.records[0] !== undefined){
            localScanResult = {...scanResultsJson.records[0]};
        } else {
            localScanResult = {};
        }
        // build data elements easy to consume;
        this._processNewData();
        // update the view using 'onDidChangeTreeData' event
        this._onDidChangeTreeData.fire(undefined);
    }

    public getTreeItem(element: SCALocalVulnerabiltyElement|SCALocalLibraryElement): vscode.TreeItem | Thenable<vscode.TreeItem> {
        if (element.id==='Libraries' || element.id==='Vulnerabilities') {
            let label = element.id + ' ['+ localScanResult[element.id.toLowerCase()].length+ ']';
            return {
                label: label,
                collapsibleState: vscode.TreeItemCollapsibleState.Collapsed
            };
        }

        let treeItem: vscode.TreeItem = {
            contextValue: element.type,
            id: element.id, 
            label: element.label,
            tooltip: element.description
        };
        //console.log(treeItem);
        if (element.type==='library') {
            return treeItem;
        } else if (element.type==='vulnerability') {
            return treeItem;
        }
        console.log('Looking for tree iten with id: '+element.id);
        throw new Error("Method not implemented.");
    }
    
    public getChildren(element?: SCALocalVulnerabiltyElement|SCALocalLibraryElement | undefined): vscode.ProviderResult<SCALocalVulnerabiltyElement[]|SCALocalLibraryElement[]> {
        //throw new Error("Method not implemented.");
        if (localScanResult.vulnerabilities===undefined) {
            console.log('no vulnerabilities');
            return [];
        }
    
        if ((!element) || (element===undefined) ) {
            return getGroupingElements();
        } else if (element?.details!==undefined){
            return [];
        } else {
            if (element.type==='vulnerability'){
                return vulnerabilities;
            }  else if (element.type==='library' && element.id==='Libraries') {
                return libraries;
            }
        }
        // vscode.window.showInformationMessage("not possible "+element);
        return [];
    }

    private _processNewData() {
        //console.log('_processNewData');

        // parse the libraries in the result
        libraries = [];
        if (localScanResult.libraries!==undefined){
            libraries = localScanResult.libraries
                .map((liberary,i) => {
                    let versions = liberary.versions.map(v => v.version);
                    //console.log('got versions: '+versions+' in scanId: '+i);
                    let libElement: SCALocalLibraryElement =  {
                        id: i+'',
                        name: liberary.name,
                        description: liberary.description,
                        language: liberary.language,
                        coordinateType: liberary.coordinateType,
                        coordinate1: liberary.coordinate1,
                        coordinate2: liberary.coordinate2,
                        versions: versions,
                        type: 'library',
                        label: liberary.name+ ' ['+versions+']'

                    };
                    return libElement;
                });
        } else {
            console.log('_processing without local scan result');
        }

        // parse the vulnerabilities in the results
        vulnerabilities = [];
        if (localScanResult.vulnerabilities!==undefined){
            vulnerabilities = localScanResult.vulnerabilities
                .map((vul,i) => {
                    let libId: string = '-1';
                    let libIdMatch = libIdRegEx.exec(vul.libraries[0]._links.ref);
                    if (libIdMatch!==null && libIdMatch.index>=0 && libIdMatch[1]!==null){
                        libId = libIdMatch[1];
                    }
                    //console.log('vulnerability for liberary: '+libId+' from '+vul.libraries[0]._links.ref);
                    let libItem = libraries.filter(lib => lib.id===libId);
                    //console.log(libItem);
                    let vulDetail: SCALocalVulnerabiltyElementDetails = {
                        cve: vul.cve,
                        cvssScore: vul.cvssScore,
                        updateToVersion: vul.libraries[0].details[0].updateToVersion,
                        versionRange: vul.libraries[0].details[0].versionRange,
                        liberaries: libItem
                    };
                    let label = vul.cve;
                    if (label===undefined||label===null||label.length===0) {
                        label = 'No CVE';
                    }
                    label = label+ ' - '+vul.title;
                    //console.log(label);
                    let vulElement: SCALocalVulnerabiltyElement = {
                        id: i+'-'+vul.cve,
                        details: vulDetail,
                        type: 'vulnerability',
                        name: vul.title,
                        description: vul.overview,
                        label: label
                    };
                    return vulElement;
                });
        }

        // parse the libraries tree structure
        graph = [];
        graph = localScanResult.graphs[0].directs.
            reduce(this.reducer,[]).
            map(element => {   
                    if (element.parent===undefined) {
                        element.parent = 'Libraries';
                    }
                    return element;
                });
        console.log(graph);

    }

    private reducer = (accumulator, currentItem,i) => {
        var lib = libraries.filter(library => {
            let coords = currentItem.coords;
            return (
                (library.coordinateType===coords.coordinateType) && 
                (library.coordinate1===coords.coordinate1) &&
                (library.coordinate2===coords.coordinate2));
            });
        let currentItemsArray = [{
                id: lib[0].id,
                parent: undefined,
                library: lib[0]
            }];
        if (currentItem.directs.length>0){
            // we have childs
            console.log('adding children');
            let children = currentItem.directs.
                reduce(this.reducer,[]).
                map(element=> {
                    if (element.parent===undefined) {
                        element.parent = lib[0].id;
                    }
                    return element;
                });
            console.log('before children concat');
            currentItemsArray = currentItemsArray.concat(children);
            console.log(currentItemsArray);
        }
        console.log('before concat to accumulator');
        return accumulator.concat(currentItemsArray);
        
    }

}



function getGroupingElements(): SCALocalVulnerabiltyElement[] {
    return [
      {id: 'Libraries',type: 'library',name: 'Libraries',description:'',label:'Libraries'},
      {id: 'Vulnerabilities',type: 'vulnerability',name:'Vulnerabilities',description:'',label:'Vulnerabilities'}
    ];
  
}

let localScanResult: any = {};
let libraries: SCALocalLibraryElement[] = [];
let vulnerabilities: SCALocalVulnerabiltyElement[]= [];
let graph: SCALibraryStructure[] = [];