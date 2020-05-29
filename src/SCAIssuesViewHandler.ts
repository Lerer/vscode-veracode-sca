import * as vscode from 'vscode';
import {specificRequest} from './veracode/veracodeAPIWrapper';

interface SCAIssueElement {
    id: string
}

export class SCAIssuesViewProvider  implements vscode.TreeDataProvider<SCAIssueElement>{
    constructor(context: vscode.ExtensionContext) {    }

    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

    private currentWorkspaceId: string='';
    private currentProjectId:string='';

    getChildren (element: SCAIssueElement|undefined): SCAIssueElement[]  {
        // console.log('Issues - getChildren');
        if ((!element) || (element===undefined) || element.id==='_root') {
          // console.log('Issues - getChildren - request for root');
            if (scaIssues._embedded!==undefined && scaIssues._embedded.issues!==undefined) {
                // vscode.window.showInformationMessage("Issues - root element");
                return scaIssues._embedded.issues
                    .map(issue => { return {id: issue.id};});
            } else {
              // console.log('Issues - getChildren - request for root - no data');
                return [];
            }
        }
        if (element.id !== '_root') {
          // vscode.window.showInformationMessage("leaf element: "+element.id);
          return [];
        }
        // vscode.window.showInformationMessage("not possible "+element);
        return [];
    }

    getTreeItem (element: SCAIssueElement): vscode.TreeItem  {
        return getIssueTreeItem(element.id);
    }

    async refreshIssues(projId:string,wsId: string) {
        this.currentWorkspaceId = wsId;
        this.currentProjectId=projId;
        let res = await specificRequest('getProjectIssues',{workspace_id:wsId,project_id:projId});
        if (res.status===200 || res.status===201){
            scaIssues = {...res.data};
        }
        // console.log('refreshIssues - before fire');
        this._onDidChangeTreeData.fire(undefined);    
      }

    cleanIssues() {
      this.currentWorkspaceId = '';
      this.currentProjectId = '';
      scaIssues = {};
      this._onDidChangeTreeData.fire(undefined);
    }
};


function getIssueTreeItem(id: string): vscode.TreeItem {
    //vscode.window.showInformationMessage("getTreeItem for id "+id);
    if (id==='_root') {
      return {
        label: "Issues"
      };
    }
    let issueElement = scaIssues._embedded.issues.filter(ele => ele.id === id)[0];
    let issueType = issueElement.issue_type;
    if (issueType==='library') {
      return {
        label: 'Outdated library ['+ issueElement.library.name+' '+issueElement.library.version+'] => '+issueElement.library_updated_version
      };
    } else if (issueType === 'vulnerability') {
      let cve = issueElement.vulnerability?.cve;
      if (cve === undefined) {
        cve = 'No CVE';
      }
      return {
        label: 'Vulnerability [' + issueElement.library.name+' '+issueElement.library.version+'] => '+cve+':'+issueElement.vulnerability?.title
      };
    } else if (issueType==='license') {
      return {
        label: 'License ['+ issueElement.library.name+' '+issueElement.library.version+'] => '+issueElement.license.id+' -> with risk: '+issueElement.license.risk
      };
   
    } else {
      return {
        label: issueElement.issue_type+ ' [' + issueElement.library.name+' '+issueElement.library.version+']' ,
        //tooltip: `Tooltip for ${wsElement["name"]}`,
        resourceUri: vscode.Uri.parse(issueElement._links.self.href)
      };
    }
  }

let scaIssues : any = {   };