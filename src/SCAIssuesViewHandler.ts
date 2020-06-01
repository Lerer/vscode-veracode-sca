import * as vscode from 'vscode';
import {specificRequest} from './veracode/veracodeAPIWrapper';
import * as path from 'path';

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
      //console.log(getIssueTreeItem(element.id));
        return getIssueTreeItem(element.id);
    }

    async refreshIssues(projId:string,wsId: string) {
        this.currentWorkspaceId = wsId;
        this.currentProjectId=projId;
        let res = await specificRequest('getProjectIssues',{workspace_id:wsId,project_id:projId});
        if (res.status===200 || res.status===201){
            scaIssues = {...res.data};
        }
        console.log('issues data:');
        console.log(scaIssues);
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

function severityRating(cvssValue: number): string {
  if (cvssValue<2.1 && cvssValue>=0.1) {
    return 'very_low';
  } else if (cvssValue<4.1){
    return 'low';
  } else if (cvssValue<6.1) {
    return 'medium';
  } else if (cvssValue<8.1) {
    return 'high';
  } else if (cvssValue<10.1) {
    return 'very_high';
  } 
  return 'informational';
}


function getIssueTreeItem(id: string): vscode.TreeItem {
    //vscode.window.showInformationMessage("getTreeItem for id "+id);
    if (id==='_root') {
      return {
        label: "Issues"
      };
    }
    let issueElement = scaIssues._embedded.issues.filter(ele => ele.id === id)[0];
    let issueType = issueElement.issue_type;
    let sevRating = severityRating(issueElement.severity);
    let treeItem: vscode.TreeItem = {
      iconPath: {
        light: path.join(__dirname,'..','resources','light','severity_'+sevRating+'.svg'),
        dark: path.join(__dirname,'..','resources','dark','severity_'+sevRating+'.svg'),
      },
      resourceUri: vscode.Uri.parse(issueElement._links.html.href)
    };
    let label = issueElement.issue_type+ ' [' + issueElement.library.name+' '+issueElement.library.version+']' ;
    if (issueType==='library') { 
      label =  'Outdated library ['+ issueElement.library.name+' '+issueElement.library.version+'] => '+issueElement.library_updated_version;
    } else if (issueType === 'vulnerability') {
      let cve = issueElement.vulnerability?.cve;
      if (cve === undefined) {
        cve = 'No CVE';
      }
      label = 'Vulnerability [' + issueElement.library.name+' '+issueElement.library.version+'] => '+cve+':'+issueElement.vulnerability?.title;       
    } else if (issueType==='license') {
      label = 'License ['+ issueElement.library.name+' '+issueElement.library.version+'] => '+issueElement.license.id+' -> with risk: '+issueElement.license.risk;
    } 
    treeItem.label = label;
    return treeItem;
  }

let scaIssues : any = {   };