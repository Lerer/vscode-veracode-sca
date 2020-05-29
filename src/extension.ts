// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

//import { NodeDependenciesProvider, Dependency } from './nodeDependencies';
import {SCAWorkspacesViewProvider} from './SCAWorkspaceViewHandler';
import {specificRequest} from './veracodeWrapper';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "veracode-sca-ts" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('veracode-sca-ts.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Veracode SCA (TS)!');
	});

	vscode.commands.registerCommand("workSpaces.selectNode", async (itemId:string) => {
		vscode.window.showInformationMessage(itemId);
		//specificRequest('getFixedWorkspaceProjects',{workspace_id:itemId});
		let projectsData = specificRequest('getWorkspaceProjects',{workspace_id:itemId});
	});

	context.subscriptions.push(disposable);
	// let ws = vscode.workspace;
	// let folders = ws ? ws.workspaceFolders : undefined;
	// if (folders !== undefined) {
	// 	//const nodeDependenciesProvider = new NodeDependenciesProvider(folders[0].uri.path);
	// 	const nodeDependenciesProvider = new NodeDependenciesProvider('c:\\Users\\coby_\\OneDrive\\projects\\veracode-sca');
	// 	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	// }

	// SCA Workspaces
	const scaWorkspacesProvider = new SCAWorkspacesViewProvider(context);
	vscode.window.createTreeView('workSpaces', {
		treeDataProvider: scaWorkspacesProvider
	  });
	vscode.commands.registerCommand('workSpaces.refreshEntry', () => {
			console.log('triggered');
			scaWorkspacesProvider.refresh();
		}
	);
	scaWorkspacesProvider.refresh();
	//vscode.window.registerTreeDataProvider('workSpaces', scaWorkspacesProvider);

}

// this method is called when your extension is deactivated
export function deactivate() {}
