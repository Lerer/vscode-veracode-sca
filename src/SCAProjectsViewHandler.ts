import * as vscode from 'vscode';
import {specificRequest} from './veracodeWrapper';

interface SCAProjectElement {
    id: string
}

export class SCAProjectsViewProvider  implements vscode.TreeDataProvider<SCAProjectElement>{
    constructor(context: vscode.ExtensionContext) {    }

    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

    private currentWorkspaceId: string='';

    getChildren (element: SCAProjectElement|undefined): SCAProjectElement[]  {
        if ((!element) || (element===undefined) || element.id==='_root') {
            if (scaProjects._embedded!==undefined && scaProjects._embedded.projects!==undefined) {
                vscode.window.showInformationMessage("root element");
                return scaProjects._embedded.projects
                    .map(proj => { return {id: proj.id};});
            } else {
                return [];
            }
        }
        if (element.id !== '_root') {
          vscode.window.showInformationMessage("leaf element: "+element.id);
          return [];
        }
        vscode.window.showInformationMessage("not possible "+element);
        return [];
    }

    getTreeItem (element: SCAProjectElement): vscode.TreeItem  {
        return getProjTreeItem(element.id);
    }

    async refreshProjects(wsId: string) {
        this.currentWorkspaceId = wsId;
        let res = await specificRequest('getWorkspaceProjects',{workspace_id:wsId});
        if (res.status===200 || res.status===201){
            console.log('before refresh of data');
            scaProjects = {...res.data};
            console.log('after refresh of data');
        }
        console.log(scaProjects);
        this._onDidChangeTreeData.fire(undefined);    }
};


function getProjTreeItem(id: string): vscode.TreeItem {
    //vscode.window.showInformationMessage("getTreeItem for id "+id);
    if (id==='_root') {
      return {
        label: "Projects"
      };
    }
    let projElement = scaProjects._embedded.projects.filter(ele => ele.id === id)[0];
    return {
        label: projElement["name"]+ ' [' + projElement["languages"]+']' ,
        //tooltip: `Tooltip for ${wsElement["name"]}`,
        resourceUri: vscode.Uri.parse(projElement["_links"]["self"]["href"])
      };
  }

let scaProjects : any = {
    "_embedded":{
        "projects":[
            {
                "id":"",
                "name":"(pending Workspace selection)",
                "languages":[]
            }
        ]
    }
};