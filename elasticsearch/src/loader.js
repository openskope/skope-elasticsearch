const fs = require('fs');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

async function indexFile(host, index, type, filename) {
    const textDocument = fs.readFileSync(filename, 'utf8');
    const jsonDocument = JSON.parse(textDocument);
    return await callRESTService({
        method: 'POST', 
        path: host + "/" + index + "/" + type,
        entity: jsonDocument
    });
}

module.exports.indexFile = indexFile;