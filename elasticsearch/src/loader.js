const fs = require('fs');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

function loadJsonFromFile(filename) {
    
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

    return jsonDocument;
}
    
async function indexDocument(host, index, type, filename) {
    
    const jsonDocument = loadJsonFromFile(filename);

    return await callRESTService({
        method: 'POST', 
        path: host + "/" + index + "/" + type,
        entity: jsonDocument
    });
}

module.exports.loadJsonFromFile = loadJsonFromFile;
module.exports.indexDocument = indexDocument;