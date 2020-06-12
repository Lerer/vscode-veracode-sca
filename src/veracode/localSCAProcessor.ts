import * as vscode from 'vscode';
import { spawn } from "child_process";


//export class LocalSCAProcessor {

    
export async function runAgentBasedSCA(resultCommand:string) {
    let folders = vscode.workspace.workspaceFolders;
    let root = 'nothing';
    if (folders!==undefined && folders.length>0){
        root = folders[0].uri.fsPath;


        const srcclr = spawn("srcclr", ["scan",root,"--no-upload", "--allow-dirty", "--skip-compile","--update-advisor","--json"]);
        //const srcclr = spawn("srcclr", ["scan",root,"--allow-dirty", "--skip-compile","--update-advisor","--json"]);
        let json:string = '';
        srcclr.stdout.on("data", (data: any) => {
            json = json+data;
        });

        srcclr.stderr.on("data", (data: any) => {
            console.log(`stderr: ${data}`);
        });

        srcclr.on('error', (error: { message: any; }) => {
            console.log(`error: ${error.message}`);
        });

        srcclr.on("close", (code: any) => {
            console.log(`child process exited with code ${code}`);
            //console.log(json);
            generateJSON(resultCommand,json);
        });
    }
    console.log(root);

    // the command to collect local issues 'srcclr scan . --no-upload --json --allow-dirty --skip-compile'
}

function generateJSON(command:string,jsonStr: string): void {
    //console.log('generateJSON');
    try {
        let js:any = JSON.parse(jsonStr);
        console.log(js);
        vscode.commands.executeCommand(command,js);
    } catch (e) {
        console.log('error: '+`${e.name} ${e.message}`);
    }
}

