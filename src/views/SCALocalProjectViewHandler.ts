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
    parent?: null|SCALocalLibraryElement
}

interface SCAUnmatchedLibraryElement {
    id:string,
    version: string,
    coordinate1: string,
    coordinate2: string,
    coordinateType: string,
    type: string,
    details?:any
    label:string,
    name: string,
    description: string
}

interface SCALocalVulnerabiltyElementDetails {
    cve: string|undefined,
    liberaries: SCALocalLibraryElement[],
    cvssScore: number,
    versionRange: string,
    updateToVersion: string,
    name: string,
    description: string
}

interface SCAStructureElement {
    id: string
    parent?: string
    details?: SCALocalLibraryElement | SCAUnmatchedLibraryElement | SCALocalVulnerabiltyElementDetails,
    structType: "lib"| "unmatched"|"vulnerability",
    label?: string
}

const libIdRegEx:RegExp = /\/records\/0\/libraries\/([\d]+)\/versions\/0/i;

export class SCALocalViewProvider  implements vscode.TreeDataProvider<SCAStructureElement>{

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
    public async refreshLocalView(scanResultsJson? : any) {
        if (scanResultsJson===undefined){
            throw new Error("Not yet implemented");
        }
        if (scanResultsJson.records !== undefined && scanResultsJson.records[0] !== undefined){
            localScanResult = {...scanResultsJson.records[0]};
        } else {
            localScanResult = {};
        }
        // build data elements easy to consume;
        await this._processNewData();
        // update the view using 'onDidChangeTreeData' event
        this._onDidChangeTreeData.fire(undefined);
    }

    //public getTreeItem(element: SCALocalVulnerabiltyElement|SCALocalLibraryElement|SCAUnmatchedLibraryElement): vscode.TreeItem | Thenable<vscode.TreeItem> {
    public getTreeItem(element: SCAStructureElement): vscode.TreeItem | Thenable<vscode.TreeItem> {
            //console.log(element);

        // Root elements
        if (element.id==='libraries' || element.id==='vulnerabilities' || element.id==='unmatchedLibraries') {
            //console.log(element.id);
            //console.log(Object.keys(localScanResult));
            //console.log(localScanResult[element.id].length);
            let label = element.label + ' ['+ localScanResult[element.id].length+ ']';
            return {
                label: label,
                collapsibleState: vscode.TreeItemCollapsibleState.Collapsed
            };
        }

        // Generic tree item
        let context = 'vulnerability';
        if (element.structType==='lib' || element.structType==='unmatched') {
            context = 'library';
        }
        let treeItem: vscode.TreeItem = {
            contextValue: context,
            id: element.id, 
            label: element.label,
            tooltip: element.details?.description
        };
        //console.log(treeItem);
        if (element.structType==='lib') {
            let decendentsSize = graph.filter(node => node.parent===element.id).length;
            if (decendentsSize>0) {
                treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
            }
            //console.log(treeItem);
            //console.log(element);
            //console.log(element.id+ ' -> '+decendentsSize);
            return treeItem;
        } else if (element.structType==='unmatched') {
            // TODO - add collapsable function
            if (graph.filter(node => node.parent===element.id).length>0) {
                treeItem.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
            }
            return treeItem;
        } else if (element.structType==='vulnerability') {
            //console.log(element.id+' - get item for '+element.label);
            if (element.details !== undefined) {
                let vulDetail = element.details as SCALocalVulnerabiltyElementDetails;
                let sevRating = getSeverityRatingFromCVSS(vulDetail.cvssScore);
                treeItem.iconPath = {
                    light: path.join(__dirname,'..','..','resources','light','severity_'+sevRating+'.svg'),
                    dark: path.join(__dirname,'..','..','resources','dark','severity_'+sevRating+'.svg'),
                };
            }
            return treeItem;
        }
        //console.log('Looking for tree iten with id: '+element.id);
        throw new Error("Method not implemented.");
    }
    
    //public getChildren(element?: SCALocalVulnerabiltyElement|SCALocalLibraryElement|SCAUnmatchedLibraryElement | undefined): (SCALocalVulnerabiltyElement|SCALocalLibraryElement|SCAUnmatchedLibraryElement)[] {
    public getChildren(element?: SCAStructureElement|undefined): (SCAStructureElement)[] {
          //throw new Error("Method not implemented.");
        if (localScanResult.vulnerabilities===undefined) {
            console.log('no vulnerabilities');
            return [];
        }
    
        if ((!element) || (element===undefined) ) {
            return getGroupingElements();
        // } else if (element?.details!==undefined){
        //     return [];
        } else {
            if (element.structType==='vulnerability'){
                return vulnerabilities;
            }  else if (element.structType==='lib' ) {
                //console.log(element);
                //console.log('filter children for: '+element.id);
                //console.log(graph.filter(node => node.parent===element.id).length);
                return graph
                    .filter(node => node.parent===element.id);
                    //.map(node => node.details);
                //console.log(children.length);
                //return children;
                //return libraries;
            } else if (element.structType==='unmatched') {
                return unmatchedGraph;
            }
        }
        // vscode.window.showInformationMessage("not possible "+element);
        return [];
    }

    private async _processNewData() {
        //unmatchedLibraries = localScanResult.unmatchedLibraries;

        console.log('_processNewData');
        //console.log(localScanResult.unmatchedLibraries);
        // parse the libraries in the result

        unmatchedLibraries = [];
        unmatchedGraph = [];
        if (localScanResult.unmatchedLibraries!==undefined){
            console.log(localScanResult.unmatchedLibraries);
            unmatchedLibraries = await localScanResult.unmatchedLibraries
                .map((umliberary,i) => {
                    //console.log('got versions: '+versions+' in scanId: '+i);
                    let label = umliberary.coordinate1;
                    if (umliberary.coordinate2!==undefined && umliberary.coordinate2!==null) {
                        label = label+ '-'+umliberary.coordinate2;
                    }
                    label = label+ ' ['+umliberary.version+']';
                    let libElement: SCAUnmatchedLibraryElement =  {
                        id: i+'-umlib',
                        name: umliberary.coordinate1,
                        coordinateType: umliberary.coordinateType,
                        coordinate1: umliberary.coordinate1,
                        coordinate2: umliberary.coordinate2,
                        version: umliberary.version,
                        type: 'library',
                        label: label,
                        description: label

                    };
                    return libElement;
                });
            // build the liberary wrapper
            unmatchedGraph = unmatchedLibraries
                .map(umlib => {
                    let element: SCAStructureElement = {
                        id: 'struct-' + umlib.id,
                        parent: 'unmatchedLibraries',
                        details: umlib,
                        label: umlib.label,
                        structType: 'unmatched'
                    };
                    return element;
                });
        } else {
            console.log('_processing without local scan result');
        }

        libraries = [];
        if (localScanResult.libraries!==undefined){
            console.log(localScanResult.libraries.length);
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
        console.log('lib length: '+libraries.length);
        // libraries.map(lib => {
        //     if (lib.coordinate1.indexOf('grunt')>=0){
        //         console.log(lib.coordinateType+'-'+lib.coordinate1+'-['+typeof(lib.coordinate2)+']'+lib.coordinate2);
        //     }
        // });

        // parse the libraries tree structure
        graph = [];
        let directImports = localScanResult.graphs[0].directs
            .map(item => {
                let childArray = this.specialReducer(item,'libraries');
                //console.log('Child array: '+childArray.length);
                return childArray;
            });
        console.log('arracy size: '+directImports.length);
        graph=directImports.reduce(
            (graphArray:Array<any>,directImportArr) => {
                return graphArray.concat(directImportArr);
            },[]);
        // graph = localScanResult.graphs[0].directs.
        //     reduce(this.specialReducer,[]).
        //     map(element => {   
        //             if (element.parent===undefined) {
        //                 element.parent = 'libraries';
        //             }
        //             return element;
        //         });
        console.log(graph.length);
        
        //console.log('unmatched libs: '+unmatchedLibraries.length);

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
                        name: vul.title,
                        description: vul.overview,
                        liberaries: libItem
                    };
                    let label = vul.cve;
                    if (label===undefined||label===null||label.length===0) {
                        label = 'No CVE';
                    }
                    label = label+ ' - '+vul.title;
                    //console.log(label);
                    let vulElement: SCAStructureElement = {
                        id: i+'-'+vul.cve,
                        details: vulDetail,
                        structType: 'vulnerability',
                        //label: vul.title,
                        //description: vul.overview,
                        label: label
                    };
                    return vulElement;
                });
        }
    }

    //private reducer = (accumulator, currentItem,i) => {
    private specialReducer = (currentItem: any,parentId:string) => {
        //console.log(currentItem);
        let coords = currentItem.coords;
        //let currentCoordsStr = coords.coordinateType+'-'+coords.coordinate1+'-'+coords.coordinate2+'-'+coords.version;
        let coordinate2 = (coords.coordinate2 === null || coords.coordinate2 === undefined) ? '' : coords.coordinate2;
        //console.log(currentCoords);
        var lib: (SCALocalLibraryElement|SCAUnmatchedLibraryElement)[] = libraries.filter(library => {
            if (coords.coordinate2 === null || coords.coordinate2 === undefined) {
                return (
                    (library.coordinateType===coords.coordinateType) && 
                    (library.coordinate1===coords.coordinate1)
                );
            } else {           
                return (
                    (library.coordinateType===coords.coordinateType) && 
                    (library.coordinate1===coords.coordinate1) &&
                    (library.coordinate2===coordinate2));
            }
        });
        //console.log(lib.length);
        if (lib.length===0){
            //console.log(currentCoordsStr);
            //console.log(currentItem);

            lib = unmatchedLibraries.filter(umLibrary => {
                if (coords.coordinate2 === null || coords.coordinate2 === undefined) {
                    return (
                        (umLibrary.coordinateType===coords.coordinateType) && 
                        (umLibrary.coordinate1===coords.coordinate1) &&
                        (umLibrary.version===coords.version)
                    );
                } else {           
                    return (
                        (umLibrary.coordinateType===coords.coordinateType) && 
                        (umLibrary.coordinate1===coords.coordinate1) &&
                        (umLibrary.version===coords.version) &&
                        (umLibrary.coordinate2===coordinate2));
                }
            });
        }
        let currentItemId:string = parentId+'-'+lib[0].id;
        let structElementLabel = lib[0].name+' ['+coords.version+']';
        let currentItemsArray: SCAStructureElement[] = [{
                //id: lib[0].id,
                id: currentItemId,
                parent: parentId,
                details: lib[0],
                structType: 'lib',
                label: structElementLabel
            }];
        //console.log(currentItemsArray[0].parent);
        if (currentItem.directs.length>0){
            // we have childs
            //console.log('adding children');
            let children = currentItem.directs
                .map(item => this.specialReducer(item,currentItemId));     
                // reduce(this.reducer,[]).
                // map(element=> {
                //     if (element.parent===undefined) {
                //         element.parent = lib[0].id;
                //     }
                //     return element;
                // });
            //console.log('before children concat');
            //currentItemsArray = currentItemsArray.concat(children);
            currentItemsArray = children.reduce(
                (graphArray:Array<any>,directImportArr) => {
                    return graphArray.concat(directImportArr);
                },currentItemsArray);
            //console.log(currentItemsArray);
        }
        //console.log('before concat to accumulator');
        //return accumulator.concat(currentItemsArray);
        return currentItemsArray;    
    };

}

function getGroupingElements(): (SCAStructureElement)[] {
    let libs:SCAStructureElement ={id: 'libraries',structType: 'lib' as 'lib',label:'Libraries'};
    let vulns:SCAStructureElement = {id: 'vulnerabilities',structType: 'vulnerability' as 'vulnerability',label:'Vulnerabilities'};
    let mainGroups = [
        libs,
        vulns
    ];
    
    if (unmatchedLibraries.length>0) {
        let unmatched:SCAStructureElement = {id: 'unmatchedLibraries',structType: 'unmatched' as 'unmatched', label:'Unmatched Libraries'};
        mainGroups.splice(1, 0,unmatched);
    }
    return mainGroups;
  
}

let localScanResult: any = {};
let libraries: SCALocalLibraryElement[] = [];
let vulnerabilities: SCAStructureElement[]= [];
let graph: SCAStructureElement[] = [];
let unmatchedGraph: SCAStructureElement[] = [];
let unmatchedLibraries:SCAUnmatchedLibraryElement[] = [];