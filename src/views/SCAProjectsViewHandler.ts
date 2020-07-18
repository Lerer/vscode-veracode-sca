import * as vscode from 'vscode';
import {specificRequest} from '../veracode/veracodeAPIWrapper';

interface SCAProjectElement {
    workspace_id:string
    id: string
}

export class SCAProjectsViewProvider  implements vscode.TreeDataProvider<SCAProjectElement>{
    constructor(context: vscode.ExtensionContext) {  
        this.cleanProjects();
    }

    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

    private currentWorkspaceId: string='';

    getChildren (element: SCAProjectElement|undefined): SCAProjectElement[]  {
        if ((!element) || (element===undefined) ) {
            if (scaProjects._embedded!==undefined && scaProjects._embedded.projects!==undefined) {
                //vscode.window.showInformationMessage("root element");
                return scaProjects._embedded.projects
                    .map(proj => { 
                        return {
                            id: proj.id,
                            workspace_id: this.currentWorkspaceId
                        };
                    });
            } else {
                return [];
            }
        }
        if (element.id !== '_root') {
          //vscode.window.showInformationMessage("leaf element: "+element.id);
          return [];
        }
        //vscode.window.showInformationMessage("not possible "+element);
        return [];
    }

    getTreeItem (element: SCAProjectElement): vscode.TreeItem  {
        if (element.id==='_root') {
            return {
                label: "Projects"
            };
        }
        let projElement = scaProjects._embedded.projects.filter(ele => ele.id === element.id)[0];
        return {
            label: projElement["name"]+ ' [' + projElement["languages"]+']' ,
            //tooltip: `Tooltip for ${wsElement["name"]}`,
            //resourceUri: vscode.Uri.parse(projElement._links.self.href),
            command: {
                command:"wsProjects.selectNode",
                title: "Project selected",
                arguments: [projElement.id,this.currentWorkspaceId]
            }
        };
    }

    async refreshProjects(wsId: string) {
        this.currentWorkspaceId = wsId;
        let res = await specificRequest('getWorkspaceProjects',{workspace_id:wsId});
        if (res.status===200 || res.status===201){
            scaProjects = {...res.data};
        }
        // console.log(scaProjects);
        this._onDidChangeTreeData.fire(undefined);    
    }

    cleanProjects() {
        this.currentWorkspaceId = '';
        scaProjects = {...emptyProjects};
        this._onDidChangeTreeData.fire(undefined);
    }
}


// function getProjTreeItem(id: string,wsId:string): vscode.TreeItem {
//     //vscode.window.showInformationMessage("getTreeItem for id "+id);
//     if (id==='_root') {
//       return {
//         label: "Projects"
//       };
//     }
//     let projElement = scaProjects._embedded.projects.filter(ele => ele.id === id)[0];
//     return {
//         label: projElement["name"]+ ' [' + projElement["languages"]+']' ,
//         //tooltip: `Tooltip for ${wsElement["name"]}`,
//         //resourceUri: vscode.Uri.parse(projElement["_links"]["self"]["href"]),
//         resourceUri: vscode.Uri.parse(projElement._links.self.href),
//         command: {
//             command:"wsProjects.selectNode",
//             title: "Project selected",
//             arguments: [id,wsId]
//         }
//       };
//   }

let scaProjects : any;

const emptyProjects: any = {
    "_embedded":{
        "projects":[
            {
                "id":"",
                "name":"Pending Workspace selection",
                "languages":['N/A']
            }
        ]
    }
};