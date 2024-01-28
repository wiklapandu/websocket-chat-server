import fs from 'fs';

const checkOrCreateDir = (path) => {
    if(!fs.existsSync(path)) {
        fs.mkdirSync(path, {recursive: true})
    }
    return true;
}

/**
* getContentJsonFile
* 
* to get content of json file
* 
* @param {string} path path of content json file
* 
* @returns {array} the return will be array
*/
const getContentJsonFile = (path) => {
    return fs.existsSync(path) ? JSON.parse(fs.readFileSync(path), 'utf-8') : [];
}


const writeFileSync = (path, data) => {
    return fs.writeFileSync(path, data, 'utf-8');
}

export default {
    checkOrCreateDir,
    getContentJsonFile,
    writeFileSync,
}