import * as vscode from 'vscode';

export class SCAWorkspacesView  {
  constructor(context: vscode.ExtensionContext) {
    const view = vscode.window.createTreeView('workSpaces', { treeDataProvider: SCAWorkspacesTreeDataProvider(), showCollapseAll: true });
    const scaProjectsProvider = new SCAProjectsView(context);
  }
}

export class SCAProjectsView  {
  constructor(context: vscode.ExtensionContext) {
    const view = vscode.window.createTreeView('wsProjects', { treeDataProvider: SCAProjectsTreeDataProvider(), showCollapseAll: true });
    const scaIssuesProvider = new SCAIssuesView(context);
  }
}

export class SCAIssuesView  {
  constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView('wsIssues', { treeDataProvider: SCAIssuesTreeDataProvider(), showCollapseAll: true });
  }
}

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
			const treeItem = getWSTreeItem(element.id);
			return treeItem;
		}
	};
}

function getWSTreeItem(id: string): vscode.TreeItem {
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
    command: {
      command:"workSpaces.selectNode",
      title: "Workspace selected",
      arguments: [id]
    }
	};
}

function SCAProjectsTreeDataProvider(): vscode.TreeDataProvider<{ id: string }> {
  //vscode.window.showInformationMessage('SCAWorkspacesTreeDataProvider');
	return {
		getChildren: (element: {id: string}): {id: string}[] => {
      if ((!element) || (element===undefined) || element.id==='_root') {
        //vscode.window.showInformationMessage("root element");
        return scaProjects._embedded.projects
          .map(proj => { return {id: proj.id};});
      }
      if (element.id !== '_root') {
        vscode.window.showInformationMessage("leaf element: "+element.id);
        return [];
      }
      vscode.window.showInformationMessage("not possible "+element);
      return [];
    },
		getTreeItem: (element: { id: string }): vscode.TreeItem => {
			const treeItem = getProjTreeItem(element.id);
			return treeItem;
		}
	};
}

function getProjTreeItem(id: string): vscode.TreeItem {
  //vscode.window.showInformationMessage("getTreeItem for id "+id);
  if (id==='_root') {
    return {
      label: "Workspaces"
    };
  }
	let projElement = scaProjects._embedded.projects.filter(ele => ele.id === id)[0];
  return {
		label: projElement["name"]+ ' [' + projElement.languages+']' ,
    //tooltip: `Tooltip for ${wsElement["name"]}`,
    resourceUri: vscode.Uri.parse(projElement._links.self.href)
	};
}

function SCAIssuesTreeDataProvider(): vscode.TreeDataProvider<{ id: string }> {
  //vscode.window.showInformationMessage('SCAIssuesTreeDataProvider');
	return {
		getChildren: (element: {id: string}): {id: string}[] | undefined => {
      if ((!element) || (element===undefined) || element.id==='_root') {
        //vscode.window.showInformationMessage("root element");
        return scaWorkspaceIssues._embedded.issues
          .map(issue => { return {id: issue.id};});
      }
      if (element.id !== '_root') {
        vscode.window.showInformationMessage("leaf element: "+element.id);
        return [];
      }
      vscode.window.showInformationMessage("not possible "+element);
      return [];
    },
		getTreeItem: (element: { id: string }): vscode.TreeItem => {
			const treeItem = getIssueTreeItem(element.id);
			return treeItem;
		}
	};
}

function getIssueTreeItem(id: string): vscode.TreeItem {
  //vscode.window.showInformationMessage("getTreeItem for id "+id);
  if (id==='_root') {
    return {
      label: "Issues"
    };
  }
  let issueElement = scaWorkspaceIssues._embedded.issues.filter(ele => ele.id === id)[0];
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
  } else {
    return {
      label: issueElement.issue_type+ ' [' + issueElement.library.name+' '+issueElement.library.version+']' ,
      //tooltip: `Tooltip for ${wsElement["name"]}`,
      resourceUri: vscode.Uri.parse(issueElement._links.self.href)
    };
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


const scaProjects = {
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


const scaProjectDetails = {
  "id":"d27cc383-2ba7-44bc-935f-c969d8e46ab1",
  "name":"Lerer/react-complete-guide",
  "languages":["JS"],
  "total_issues_count":11,
  "vulnerability_issues_count":4,
  "library_issues_count":7,
  "license_issues_count":0,
  "last_scan_date":"2020-03-03T00:47:40.791+0000",
  "branches":["master","scoped-CSS"],
  "site_id":166965,
  "_links":{
    "self":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491/projects/d27cc383-2ba7-44bc-935f-c969d8e46ab1"}
  }};

  
  const scaWorkspaceIssues = {
    "_embedded":{
      "issues":[
        {
          "id":"1bace06d-c327-4954-a65a-6196af60c61b",
          "site_id":29154404,
          "created_date":"2020-03-03T00:47:48.488+0000",
          "issue_status":"open",
          "issue_type":"library",
          "ignored":false,
          "severity":3,
          "workspace_id":"2a5d2d8e-fe51-4af7-bc31-b4eef4e96491",
          "project_id":"d27cc383-2ba7-44bc-935f-c969d8e46ab1",
          "project_name":"Lerer/react-complete-guide",
          "project_branch":"master",
          "library":{
            "id":"npm:styled-components::5.0.0:",
            "name":"styled-components",
            "version":"5.0.0",
            "direct":true,
            "transitive":false,
            "_links":{
              "self":{"href":"https://api.veracode.com/srcclr/v3/libraries/npm:styled-components::5.0.0:"}
            }
          },
          "library_updated_version":"5.0.1",
          "library_updated_release_date":"2020-02-04T00:00:00.000+0000",
          "_links":{
            "workspace":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491"},
            "html":{"href":"https://sca.analysiscenter.veracode.com/teams/eppFVzy/issues/libraries/29154404"},
            "self":{"href":"https://api.veracode.com/srcclr/v3/issues/1bace06d-c327-4954-a65a-6196af60c61b"}}
          },
          {"id":"aee9c7c5-c2c9-46c3-b1e7-6c81b34fedfc","site_id":29154403,"created_date":"2020-03-03T00:47:48.488+0000","issue_status":"open","issue_type":"library","ignored":false,"severity":3,"workspace_id":"2a5d2d8e-fe51-4af7-bc31-b4eef4e96491","project_id":"d27cc383-2ba7-44bc-935f-c969d8e46ab1","project_name":"Lerer/react-complete-guide","project_branch":"master","library":{"id":"npm:react::16.12.0:","name":"react","version":"16.12.0","direct":true,"transitive":false,"_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/libraries/npm:react::16.12.0:"}}},"library_updated_version":"16.13.0","library_updated_release_date":"2020-02-26T00:00:00.000+0000","_links":{"workspace":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491"},"html":{"href":"https://sca.analysiscenter.veracode.com/teams/eppFVzy/issues/libraries/29154403"},"self":{"href":"https://api.veracode.com/srcclr/v3/issues/aee9c7c5-c2c9-46c3-b1e7-6c81b34fedfc"}}},{"id":"21f8964d-92f8-4be6-98db-78ca12388410","site_id":29154402,"created_date":"2020-03-03T00:47:48.488+0000","issue_status":"open","issue_type":"library","ignored":false,"severity":3,"workspace_id":"2a5d2d8e-fe51-4af7-bc31-b4eef4e96491","project_id":"d27cc383-2ba7-44bc-935f-c969d8e46ab1","project_name":"Lerer/react-complete-guide","project_branch":"master","library":{"id":"npm:react-scripts::3.3.0:","name":"react-scripts","version":"3.3.0","direct":true,"transitive":false,"_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/libraries/npm:react-scripts::3.3.0:"}}},"library_updated_version":"3.4.0","library_updated_release_date":"2020-02-14T00:00:00.000+0000","_links":{"workspace":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491"},"html":{"href":"https://sca.analysiscenter.veracode.com/teams/eppFVzy/issues/libraries/29154402"},"self":{"href":"https://api.veracode.com/srcclr/v3/issues/21f8964d-92f8-4be6-98db-78ca12388410"}}},{"id":"e6f2ccf9-ecb5-4118-9b81-8cc222be75f0","site_id":29154401,"created_date":"2020-03-03T00:47:48.488+0000","issue_status":"open","issue_type":"library","ignored":false,"severity":3,"workspace_id":"2a5d2d8e-fe51-4af7-bc31-b4eef4e96491","project_id":"d27cc383-2ba7-44bc-935f-c969d8e46ab1","project_name":"Lerer/react-complete-guide","project_branch":"master","library":{"id":"npm:react-dom::16.12.0:","name":"react-dom","version":"16.12.0","direct":true,"transitive":false,"_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/libraries/npm:react-dom::16.12.0:"}}},"library_updated_version":"16.13.0","library_updated_release_date":"2020-02-26T00:00:00.000+0000","_links":{"workspace":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491"},"html":{"href":"https://sca.analysiscenter.veracode.com/teams/eppFVzy/issues/libraries/29154401"},"self":{"href":"https://api.veracode.com/srcclr/v3/issues/e6f2ccf9-ecb5-4118-9b81-8cc222be75f0"}}},{"id":"9029b1d7-6f4a-4ce9-a484-564b6d104347","site_id":29154400,"created_date":"2020-03-03T00:47:48.488+0000","issue_status":"open","issue_type":"library","ignored":false,"severity":3,"workspace_id":"2a5d2d8e-fe51-4af7-bc31-b4eef4e96491","project_id":"d27cc383-2ba7-44bc-935f-c969d8e46ab1","project_name":"Lerer/react-complete-guide","project_branch":"master","library":{"id":"npm:@testing-library/user-event::7.2.1:","name":"@testing-library/user-event","version":"7.2.1","direct":true,"transitive":false,"_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/libraries/npm:@testing-library/user-event::7.2.1:"}}},"library_updated_version":"10.0.0","library_updated_release_date":"2020-02-17T00:00:00.000+0000","_links":{"workspace":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491"},"html":{"href":"https://sca.analysiscenter.veracode.com/teams/eppFVzy/issues/libraries/29154400"},"self":{"href":"https://api.veracode.com/srcclr/v3/issues/9029b1d7-6f4a-4ce9-a484-564b6d104347"}}},{"id":"00910ee3-731e-4daf-ac0c-da916da23461","site_id":29154399,"created_date":"2020-03-03T00:47:48.488+0000","issue_status":"open","issue_type":"library","ignored":false,"severity":3,"workspace_id":"2a5d2d8e-fe51-4af7-bc31-b4eef4e96491","project_id":"d27cc383-2ba7-44bc-935f-c969d8e46ab1","project_name":"Lerer/react-complete-guide","project_branch":"master","library":{"id":"npm:@testing-library/react::9.4.0:","name":"@testing-library/react","version":"9.4.0","direct":true,"transitive":false,"_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/libraries/npm:@testing-library/react::9.4.0:"}}},"library_updated_version":"9.4.1","library_updated_release_date":"2020-02-22T00:00:00.000+0000","_links":{"workspace":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491"},"html":{"href":"https://sca.analysiscenter.veracode.com/teams/eppFVzy/issues/libraries/29154399"},"self":{"href":"https://api.veracode.com/srcclr/v3/issues/00910ee3-731e-4daf-ac0c-da916da23461"}}},{"id":"cee3a9f7-83bc-4c3b-b59d-994846647751","site_id":29154398,"created_date":"2020-03-03T00:47:48.488+0000","issue_status":"open","issue_type":"library","ignored":false,"severity":3,"workspace_id":"2a5d2d8e-fe51-4af7-bc31-b4eef4e96491","project_id":"d27cc383-2ba7-44bc-935f-c969d8e46ab1","project_name":"Lerer/react-complete-guide","project_branch":"master","library":{"id":"npm:@testing-library/jest-dom::4.2.4:","name":"@testing-library/jest-dom","version":"4.2.4","direct":true,"transitive":false,"_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/libraries/npm:@testing-library/jest-dom::4.2.4:"}}},"library_updated_version":"5.1.1","library_updated_release_date":"2020-02-03T00:00:00.000+0000","_links":{"workspace":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491"},"html":{"href":"https://sca.analysiscenter.veracode.com/teams/eppFVzy/issues/libraries/29154398"},"self":{"href":"https://api.veracode.com/srcclr/v3/issues/cee3a9f7-83bc-4c3b-b59d-994846647751"}}},{"id":"bac0de88-2309-430c-97b0-3f0964e4d0dc","site_id":29154397,"created_date":"2020-03-03T00:47:48.488+0000","issue_status":"open","issue_type":"vulnerability","ignored":false,"severity":5,"workspace_id":"2a5d2d8e-fe51-4af7-bc31-b4eef4e96491","project_id":"d27cc383-2ba7-44bc-935f-c969d8e46ab1","project_name":"Lerer/react-complete-guide","project_branch":"master","library":{"id":"npm:request::2.88.0:","name":"request","version":"2.88.0","direct":false,"transitive":true,"_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/libraries/npm:request::2.88.0:"}}},"vulnerability":{"id":"21913","title":"Prototype Pollution","_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/vulnerabilities/21913"}}},"vulnerable_method":false,"_links":{"vulnerability":{"href":"https://api.veracode.com/srcclr/v3/vulnerabilities/21913"},"workspace":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491"},"html":{"href":"https://sca.analysiscenter.veracode.com/teams/eppFVzy/issues/vulnerabilities/29154397"},"self":{"href":"https://api.veracode.com/srcclr/v3/issues/bac0de88-2309-430c-97b0-3f0964e4d0dc"}}},{"id":"b34911a5-72a3-4456-b862-c8226b1e5c52","site_id":29154396,"created_date":"2020-03-03T00:47:48.488+0000","issue_status":"open","issue_type":"vulnerability","ignored":false,"severity":5,"workspace_id":"2a5d2d8e-fe51-4af7-bc31-b4eef4e96491","project_id":"d27cc383-2ba7-44bc-935f-c969d8e46ab1","project_name":"Lerer/react-complete-guide","project_branch":"master","library":{"id":"npm:kind-of::6.0.2:","name":"kind-of","version":"6.0.2","direct":false,"transitive":true,"_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/libraries/npm:kind-of::6.0.2:"}}},"vulnerability":{"id":"22182","title":"Prototype Pollution","cve":"2019-20149","_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/vulnerabilities/22182"}}},"vulnerable_method":false,"_links":{"vulnerability":{"href":"https://api.veracode.com/srcclr/v3/vulnerabilities/22182"},"workspace":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491"},"html":{"href":"https://sca.analysiscenter.veracode.com/teams/eppFVzy/issues/vulnerabilities/29154396"},"self":{"href":"https://api.veracode.com/srcclr/v3/issues/b34911a5-72a3-4456-b862-c8226b1e5c52"}}},{"id":"5db3282f-a51e-47c9-b97c-d730fb713188","site_id":29154395,"created_date":"2020-03-03T00:47:48.488+0000","issue_status":"open","issue_type":"vulnerability","ignored":false,"severity":7.5,"workspace_id":"2a5d2d8e-fe51-4af7-bc31-b4eef4e96491","project_id":"d27cc383-2ba7-44bc-935f-c969d8e46ab1","project_name":"Lerer/react-complete-guide","project_branch":"master","library":{"id":"npm:dot-prop::4.2.0:","name":"dot-prop","version":"4.2.0","direct":false,"transitive":true,"_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/libraries/npm:dot-prop::4.2.0:"}}},"vulnerability":{"id":"22393","title":"Prototype Pollution","cve":"2020-8116","_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/vulnerabilities/22393"}}},"vulnerable_method":false,"_links":{"vulnerability":{"href":"https://api.veracode.com/srcclr/v3/vulnerabilities/22393"},"workspace":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491"},"html":{"href":"https://sca.analysiscenter.veracode.com/teams/eppFVzy/issues/vulnerabilities/29154395"},"self":{"href":"https://api.veracode.com/srcclr/v3/issues/5db3282f-a51e-47c9-b97c-d730fb713188"}}},{"id":"4c100d90-abb0-41a2-9659-4ed6a9243a64","site_id":29154394,"created_date":"2020-03-03T00:47:48.488+0000","issue_status":"open","issue_type":"vulnerability","ignored":false,"severity":6.8,"workspace_id":"2a5d2d8e-fe51-4af7-bc31-b4eef4e96491","project_id":"d27cc383-2ba7-44bc-935f-c969d8e46ab1","project_name":"Lerer/react-complete-guide","project_branch":"master","library":{"id":"npm:@hapi/hoek::8.5.0:","name":"@hapi/hoek","version":"8.5.0","direct":false,"transitive":true,"_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/libraries/npm:@hapi/hoek::8.5.0:"}}},"vulnerability":{"id":"22483","title":"Prototype Pollution","_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/vulnerabilities/22483"}}},"vulnerable_method":false,"_links":{"vulnerability":{"href":"https://api.veracode.com/srcclr/v3/vulnerabilities/22483"},"workspace":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491"},"html":{"href":"https://sca.analysiscenter.veracode.com/teams/eppFVzy/issues/vulnerabilities/29154394"},"self":{"href":"https://api.veracode.com/srcclr/v3/issues/4c100d90-abb0-41a2-9659-4ed6a9243a64"}}}]},"_links":{"self":{"href":"https://api.veracode.com/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491/issues?project_id=d27cc383-2ba7-44bc-935f-c969d8e46ab1&page=0&size=20&sort=created_date,desc"}},"page":{"size":20,"total_elements":11,"total_pages":1,"number":0}}
;

