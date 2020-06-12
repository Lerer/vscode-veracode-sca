// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

//import { NodeDependenciesProvider, Dependency } from './nodeDependencies';
import {SCAWorkspacesViewProvider} from './views/SCAWorkspaceViewHandler';
import {SCAProjectsViewProvider} from './views/SCAProjectsViewHandler';
import {SCAIssuesViewProvider} from './views/SCAIssuesViewHandler';
import {SCALocalViewProvider} from './views/SCALocalProjectViewHandler';
import {runAgentBasedSCA} from './veracode/localSCAProcessor';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "veracode-sca" is now active!');
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	//let disposable = vscode.commands.registerCommand('veracode-sca-ts.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
	//	vscode.window.showInformationMessage('Hello World from Veracode SCA (TS)!');
	//});

	//context.subscriptions.push(disposable);
	
	// SCA Workspaces
	const scaWorkspacesProvider = new SCAWorkspacesViewProvider(context);
	vscode.window.createTreeView('workSpaces', {
		treeDataProvider: scaWorkspacesProvider
	});
	vscode.commands.registerCommand('workSpaces.refreshEntry', () => {
			scaWorkspacesProvider.refresh();
			scaProjectsProvider.cleanProjects();
			scaIssuesProvider.cleanIssues();
		}
	);

	// SCA Projects
	const scaProjectsProvider = new SCAProjectsViewProvider(context);
	vscode.window.createTreeView('wsProjects', {
		treeDataProvider: scaProjectsProvider
	});

	vscode.commands.registerCommand("workSpaces.selectNode", async (itemId:string) => {
		scaProjectsProvider.refreshProjects(itemId);
		scaIssuesProvider.cleanIssues();
	});

	// SCA Issues
	const scaIssuesProvider = new SCAIssuesViewProvider(context);
	vscode.window.createTreeView('wsIssues',{treeDataProvider: scaIssuesProvider});
	vscode.commands.registerCommand("wsProjects.selectNode", async (projId:string,wsId:string) => {
		scaIssuesProvider.refreshIssues(projId,wsId);
	});

	// SCA Local scan
	const localProjectProvider = new SCALocalViewProvider();
	vscode.window.createTreeView('localProject', {
		treeDataProvider: localProjectProvider
	});

	vscode.commands.registerCommand('localProject.refreshContent', async() => {
		console.log('localProject.refreshContent');
		localProjectProvider.callForRefresh();
	});	

	vscode.commands.registerCommand('localProject.inputContent', async(args:any) => {
		localProjectProvider.refreshLocalView(args);
	});

	// load Workspace list on load
	scaWorkspacesProvider.refresh();
	localProjectProvider.callForRefresh();
	console.log('extension finish activation');
}

// this method is called when your extension is deactivated
export function deactivate() {}
