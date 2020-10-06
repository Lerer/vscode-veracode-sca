import {generateHeader} from  './hmacHandler.js';
import axios from 'axios';

interface RequestDetails {
    name: string
    path: string;
    host: string;
    method: string;
    queryParams: string;
}

const idRegEx:RegExp = /[a-z\d]{8}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{12}/i;

const requests: RequestDetails[] = [
    {
        name: "getWorkspaces",
        path: '/srcclr/v3/workspaces',
        host: 'api.veracode.com',
        method: 'GET',
        queryParams: ''
    },
    {
        name: "getApplications",
        path: '/appsec/v1/applications',
        host: 'api.veracode.com',
        method: 'GET',
        queryParams: ''
    },
    {
        name: "getWorkspaceProjects",
        path: '/srcclr/v3/workspaces/<workspace_id>/projects',
        host: 'api.veracode.com',
        method: 'GET',
        queryParams: ''
    },
    {
        name: "getProjectDetails",
        path: '/srcclr/v3/workspaces/2a5d2d8e-fe51-4af7-bc31-b4eef4e96491/projects/<project_id>',
        host: 'api.veracode.com',
        method: 'GET',
        queryParams: ''
    },
    {
        name: "getProjectIssues",
        path: '/srcclr/v3/workspaces/<workspace_id>/issues?project_id=<project_id>&size=1000',
        host: 'api.veracode.com',
        method: 'GET',
        queryParams: ''
    }
];

export async function specificRequest (requestType:string,parameters:any|undefined|null) {
    let requestObj:RequestDetails = requests.filter(obj=> obj.name===requestType)[0];
    let res = {
        message: 'No specific request found',
        status: 404,
        data: {}
    };
    if (requestObj !== undefined) {
        // replace parameters
        let newPath:string = replaceParameters(requestObj.path,parameters);
        // setup a new parameterize request details object
        let specificReqObj = {...requestObj,path:newPath};

        // generate the hmac header
        const header = await requestSpecificRequestHeader(specificReqObj);
        if (header!==undefined) {
            
            let query = specificReqObj.queryParams || '';
            const url = 'https://'+specificReqObj.host+specificReqObj.path+query;
           
            let apiService = new ApiService();
            let apiRes = await apiService.query(header,url);
            res = {
                message: apiRes.statusText,
                status: apiRes.status,
                data: apiRes.data
            };
        } else {
            res = {
                message: 'couldn\'t generate header',
                data: {},
                status: 401
            };
        }
    }
    return res;
}

async function requestSpecificRequestHeader (requestObj:RequestDetails)  {
    //let requestObj:RequestDetails = requests.filter(obj=> obj.name===requestType)[0];
    if (requestObj !== undefined) {
        return generateHeader(requestObj.host,requestObj.path+requestObj.queryParams,requestObj.method);
    }
} 

export class ApiService {
    async query(authHeader:string,url:string) {
        // console.log(url);
        // console.log(authHeader);
        const response = await axios.get(url, 
            { headers: 
                { 
                    Authorization: authHeader,
                    'Accept-Encoding': "" 
                } 
            })
            .catch(error => {
                console.log(error.message);
                return error.response;
            });
        //console.log(response);
        // console.log(response.data);
        // console.log(response.status);
        // console.log(response.statusText);
        // console.log(response.headers);
        // console.log(response.config);
        return response;
    }
}

function validID (id: string) {
    return idRegEx.test(id);
}

function replaceParameters(requestPath:string,parameters: any|undefined|null) {
    //console.log(requestPath);
    // console.log(parameters);
    let newPath = requestPath;
    if (parameters===undefined || parameters ===null || parameters==={}){
        return newPath;
    } else {
        if (requestPath.indexOf('<project_id>')>-1 && parameters.project_id!==undefined && validID(parameters.project_id)){
            newPath = newPath.replace('<project_id>',parameters.project_id);
        }
        if (requestPath.indexOf('<workspace_id>')>-1 && parameters.workspace_id!==undefined && validID(parameters.workspace_id)){
            newPath = newPath.replace('<workspace_id>',parameters.workspace_id);
        }
    }
    // console.log(newPath);
    return newPath;
}
