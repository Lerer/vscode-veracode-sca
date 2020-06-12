import * as vscode from 'vscode';
import {specificRequest} from '../veracode/veracodeAPIWrapper';
import {getSeverityRatingFromCVSS} from '../veracode/constants';
import * as path from 'path';

interface SCAIssueElement {
    id: string,
    type: string
}

export class SCAIssuesViewProvider  implements vscode.TreeDataProvider<SCAIssueElement>{
    constructor(context: vscode.ExtensionContext) {    }

    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

    //private currentWorkspaceId: string='';
    //private currentProjectId:string='';

    getChildren (element: SCAIssueElement|undefined): SCAIssueElement[]  {
      if (scaIssues._embedded===undefined || scaIssues._embedded.issues===undefined) {
        return [];
      }

      let issues = scaIssues._embedded.issues;

      if ((!element) || (element===undefined) ) {
        return getGroupingElements();
      } else if (element?.id.length>19){
        return [];
      } else {
        // get grouped elements
        // vscode.window.showInformationMessage("Issues - root element");
        return issues.
          filter(issue => issue.issue_type===element.type).
          map(issue => { return {
            id: issue.id,
            type:issue.issue_type
          };});    
      }
      // vscode.window.showInformationMessage("not possible "+element);
      return [];
    }

    getTreeItem (element: SCAIssueElement): vscode.TreeItem  {
        return getIssueTreeItem(element);
    }

    async refreshIssues(projId:string,wsId: string) {
        //this.currentWorkspaceId = wsId;
        //this.currentProjectId=projId;
        let res = await specificRequest('getProjectIssues',{workspace_id:wsId,project_id:projId});
        if (res.status===200 || res.status===201){
            scaIssues = {...res.data};
        }
        
        this._onDidChangeTreeData.fire(undefined);    
      }

    cleanIssues() {
      //this.currentWorkspaceId = '';
      //this.currentProjectId = '';
      scaIssues = {};
      this._onDidChangeTreeData.fire(undefined);
    }
};

function getGroupingElements(): SCAIssueElement[] {
  return [
    {id: 'Outdated libraries',type: 'library'},
    {id: 'Vulnerabilities',type: 'vulnerability'},
    {id: 'Licenses',type: 'license'}
  ];

}


function getIssueTreeItem(element:SCAIssueElement): vscode.TreeItem {
  let id = element.id;
  //console.log('issues - get tree item got: '+id);
    //vscode.window.showInformationMessage("getTreeItem for id "+id);
    if (id.length<19) {
      let label = id + ' ['+ scaIssues._embedded.issues.filter(issue => issue.issue_type===element.type).length+ ']';
      return {
        label: label,
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed
      };
    }
    //console.log(scaIssues._embedded === undefined);
    let issueElement = scaIssues._embedded.issues.filter(ele => ele.id === id)[0];
    let issueType = issueElement.issue_type;
    let sevRating = getSeverityRatingFromCVSS(issueElement.severity);
    let treeItem: vscode.TreeItem = {
      iconPath: {
        light: path.join(__dirname,'..','resources','light','severity_'+sevRating+'.svg'),
        dark: path.join(__dirname,'..','resources','dark','severity_'+sevRating+'.svg'),
      },
      resourceUri: vscode.Uri.parse(issueElement._links.html.href),
      contextValue: issueType
    };
    let label = issueElement.issue_type+ ' [' + issueElement.library.name+' '+issueElement.library.version+']' ;
    if (issueType==='library') { 
      label =  ''+ issueElement.library.name+' ['+issueElement.library.version+'] => ['+issueElement.library_updated_version+']';
    } else if (issueType === 'vulnerability') {
      let cve = issueElement.vulnerability?.cve;
      if (cve === undefined) {
        cve = 'No CVE';
      }
      label = issueElement.library.name+' '+issueElement.library.version+' => '+cve+': '+issueElement.vulnerability?.title;       
    } else if (issueType==='license') {
      label = issueElement.library.name+' '+issueElement.library.version+' => '+issueElement.license.id+' -> with risk: '+issueElement.license.risk;
    } 
    treeItem.label = label;
    return treeItem;
  }

let scaIssues : any = {   };