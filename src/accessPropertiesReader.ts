import * as path from 'path';
import * as os from 'os';
import * as ConfigParser from 'configparser';

export function getLocalAuthorization (authProfile:string|undefined)  {
    if (!authProfile || authProfile===undefined) {
        authProfile = 'default';
    }
    let veracodeCredsFile = path.join(os.homedir(), '.veracode', 'credentials');
    let config = new ConfigParser();
    config.read(veracodeCredsFile);
    let id = config.get(authProfile, 'veracode_api_key_id');
    let secret = config.get(authProfile, 'veracode_api_key_secret'); 

    return {API_ID:id,SECRET:secret};
}

