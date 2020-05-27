import * as vscode from 'vscode';

export class SCAWorkspacesView  {
  constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView('workSpaces', { treeDataProvider: SCAWorkspacesTreeDataProvider(), showCollapseAll: true });
  }
}

const scaWorkspaces = {
  "_embedded":{
    "workspaces":[
      {
        "id":"2a5d2d8e-fe51-4af7-bc31-b4eef4e96491",
        "name":"Branches",
        "site_id":"eppFVzy",
        "sandbox":false,
        "projects_count":2,
        "total_issues_count":19,
        "vulnerability_issues_count":9,
        "library_issues_count":10,
        "license_issues_count":0,
        "custom_policy_enabled":false,
        "last_scan_date":"2020-05-10T02:18:37.785+0000",
        "_links":{
          "self":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491"},
          "issues":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491/issues{?ignored,branch,direct,vuln_methods,severity_gt,severity_gte,severity_lt,severity_lte,created_after,created_before,scans_after,scans_before,search}","templated":true},
          "projects":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491/projects"},
          "libraries":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491/libraries{?direct,out_of_date,has_vulnerabilities,search}","templated":true},
          "unmatched-libraries":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491/libraries/unmatched{?search}","templated":true},
          "teams":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491/teams"},
          "agents":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491/agents"}
        }
      },
      {
        "id":"e37a8d53-0108-4434-bd12-be2e89ab748e","name":"JS Test Workspace","site_id":"qWWIKej","sandbox":false,"projects_count":2,"total_issues_count":113,"vulnerability_issues_count":87,"library_issues_count":26,"license_issues_count":0,"custom_policy_enabled":false,"last_scan_date":"2020-01-12T05:24:53.335+0000","_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/workspaces/e37a8d53-0108-4434-bd12-be2e89ab748e"},"issues":{"href":"https://api.veracode.com/srcclr/v3/workspaces/e37a8d53-0108-4434-bd12-be2e89ab748e/issues{?ignored,branch,direct,vuln_methods,severity_gt,severity_gte,severity_lt,severity_lte,created_after,created_before,scans_after,scans_before,search}","templated":true},"projects":{"href":"https://api.veracode.com/srcclr/v3/workspaces/e37a8d53-0108-4434-bd12-be2e89ab748e/projects"},"libraries":{"href":"https://api.veracode.com/srcclr/v3/workspaces/e37a8d53-0108-4434-bd12-be2e89ab748e/libraries{?direct,out_of_date,has_vulnerabilities,search}","templated":true},"unmatched-libraries":{"href":"https://api.veracode.com/srcclr/v3/workspaces/e37a8d53-0108-4434-bd12-be2e89ab748e/libraries/unmatched{?search}","templated":true},"teams":{"href":"https://api.veracode.com/srcclr/v3/workspaces/e37a8d53-0108-4434-bd12-be2e89ab748e/teams"},"agents":{"href":"https://api.veracode.com/srcclr/v3/workspaces/e37a8d53-0108-4434-bd12-be2e89ab748e/agents"}}},{"id":"fdca16c2-f81a-4f3f-a991-b5c77c865a56","name":"Verademo","site_id":"700tE4y","sandbox":false,"projects_count":2,"total_issues_count":66,"vulnerability_issues_count":25,"library_issues_count":35,"license_issues_count":6,"custom_policy_enabled":false,"last_scan_date":"2020-05-25T14:06:53.364+0000","_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/workspaces/fdca16c2-f81a-4f3f-a991-b5c77c865a56"},"issues":{"href":"https://api.veracode.com/srcclr/v3/workspaces/fdca16c2-f81a-4f3f-a991-b5c77c865a56/issues{?ignored,branch,direct,vuln_methods,severity_gt,severity_gte,severity_lt,severity_lte,created_after,created_before,scans_after,scans_before,search}","templated":true},"projects":{"href":"https://api.veracode.com/srcclr/v3/workspaces/fdca16c2-f81a-4f3f-a991-b5c77c865a56/projects"},"libraries":{"href":"https://api.veracode.com/srcclr/v3/workspaces/fdca16c2-f81a-4f3f-a991-b5c77c865a56/libraries{?direct,out_of_date,has_vulnerabilities,search}","templated":true},"unmatched-libraries":{"href":"https://api.veracode.com/srcclr/v3/workspaces/fdca16c2-f81a-4f3f-a991-b5c77c865a56/libraries/unmatched{?search}","templated":true},"teams":{"href":"https://api.veracode.com/srcclr/v3/workspaces/fdca16c2-f81a-4f3f-a991-b5c77c865a56/teams"},"agents":{"href":"https://api.veracode.com/srcclr/v3/workspaces/fdca16c2-f81a-4f3f-a991-b5c77c865a56/agents"}}},{"id":"e63479f2-7444-4e19-9274-388b6f1abbd6","name":"Workspace 1","site_id":"qWWIKjO","sandbox":false,"projects_count":6,"total_issues_count":255,"vulnerability_issues_count":76,"library_issues_count":149,"license_issues_count":30,"custom_policy_enabled":false,"last_scan_date":"2020-05-25T01:12:18.805+0000","_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/workspaces/e63479f2-7444-4e19-9274-388b6f1abbd6"},"issues":{"href":"https://api.veracode.com/srcclr/v3/workspaces/e63479f2-7444-4e19-9274-388b6f1abbd6/issues{?ignored,branch,direct,vuln_methods,severity_gt,severity_gte,severity_lt,severity_lte,created_after,created_before,scans_after,scans_before,search}","templated":true},"projects":{"href":"https://api.veracode.com/srcclr/v3/workspaces/e63479f2-7444-4e19-9274-388b6f1abbd6/projects"},"libraries":{"href":"https://api.veracode.com/srcclr/v3/workspaces/e63479f2-7444-4e19-9274-388b6f1abbd6/libraries{?direct,out_of_date,has_vulnerabilities,search}","templated":true},"unmatched-libraries":{"href":"https://api.veracode.com/srcclr/v3/workspaces/e63479f2-7444-4e19-9274-388b6f1abbd6/libraries/unmatched{?search}","templated":true},"teams":{"href":"https://api.veracode.com/srcclr/v3/workspaces/e63479f2-7444-4e19-9274-388b6f1abbd6/teams"},"agents":{"href":"https://api.veracode.com/srcclr/v3/workspaces/e63479f2-7444-4e19-9274-388b6f1abbd6/agents"}}}
      ]
    },
    "_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/workspaces?page=0&size=20&sort=name,asc"}},
    "page": {
      "size":20,
      "total_elements":4,
      "total_pages":1,
      "number":0
    }
  };

const projects = {
  "_embedded":{
    "projects":[
      {
        "id":"d27cc383-2ba7-44bc-935f-c969d8e46ab1",
        "name":"Lerer/react-complete-guide",
        "languages":["JS"],
        "total_issues_count":11,
        "vulnerability_issues_count":4,
        "library_issues_count":7,
        "license_issues_count":0,
        "last_scan_date":"2020-03-03T00:47:40.791+0000",
        "site_id":166965,
        "_links":{
          "self":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491/projects/d27cc383-2ba7-44bc-935f-c969d8e46ab1"}
        }
      },
      {"id":"ab9f3256-908a-4e70-914a-a5caa9e35fe3","name":"Lerer/react-complete-guide-burger","languages":["JS"],"total_issues_count":8,"vulnerability_issues_count":5,"library_issues_count":3,"license_issues_count":0,"last_scan_date":"2020-05-10T02:18:37.785+0000","site_id":195863,"_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491/projects/ab9f3256-908a-4e70-914a-a5caa9e35fe3"}}}
    ]
  },
  "_links":{
    "self":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491/projects?page=0&size=20&sort=name,asc"}
  },
  "page":{"size":20,"total_elements":2,"total_pages":1,"number":0}
};

function SCAWorkspacesTreeDataProvider(): vscode.TreeDataProvider<{ id: string }> {
  //vscode.window.showInformationMessage('SCAWorkspacesTreeDataProvider');
	return {
		getChildren: (element: {id: string}): {id: string}[] => {
      if ((!element) || (element===undefined) || element.id==='_root') {
        //vscode.window.showInformationMessage("root element");
        return scaWorkspaces._embedded.workspaces
          .map(ws => { return {id: ws.id};});
      }
      if (element.id !== '_root') {
        vscode.window.showInformationMessage("leaf element: "+element.id);
        return [];
      }
      vscode.window.showInformationMessage("not possible "+element);
      return [];
    },
		getTreeItem: (element: { id: string }): vscode.TreeItem => {
			const treeItem = getTreeItem(element.id);
			return treeItem;
		}
	};
}

function getTreeItem(id: string): vscode.TreeItem {
  //vscode.window.showInformationMessage("getTreeItem for id "+id);
  if (id==='_root') {
    return {
      label: "Workspaces"
    };
  }
	let wsElement = scaWorkspaces._embedded.workspaces.filter(ele => ele.id === id)[0];
  //vscode.window.showInformationMessage("getTreeItem "+wsElement);
  return {
		label: wsElement["name"],
    tooltip: `Tooltip for ${wsElement["name"]}`,
    resourceUri: vscode.Uri.parse(wsElement._links.self.href),
    
	};
}
