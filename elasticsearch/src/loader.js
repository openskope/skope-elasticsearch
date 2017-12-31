const fs = require('fs');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

async function indexFile(host, index, type, filename) {
    
    var textDocument;    
    try {
        textDocument = fs.readFileSync(filename, 'utf8');
    }
    catch(e) {
        throw `File '${filename}' could not be read.`
    }

    var jsonDocument;
    try { 
        jsonDocument = JSON.parse(textDocument);
    } catch(e) {
        throw {
            'message': 'Error parsing JSON document',
            'details': e.message
        }
    }

    return await callRESTService({
        method: 'POST', 
        path: host + "/" + index + "/" + type,
        entity: jsonDocument
    });
}

module.exports.indexFile = indexFile;