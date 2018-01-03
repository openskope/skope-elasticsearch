
const es = require('../../es');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

var document = {
    "first_name" : "John",
    "last_name" :  "Smith",
    "age" :        25,
    "about" :      "I love to go rock climbing",
    "interests": [ "sports", "music" ]
};

var documentId;

beforeAll(async () => {

    var postResponse = await callRESTService({
        method: 'POST', 
        path: esClusterUrl + '/megacorp/employee/',
        entity: document
    });

    documentId = postResponse.entity._id;

    await es.refreshAll(esClusterUrl);    
});

describe("When a document exists in elasticsearch", async () => {

    it ('a HEAD request for the document should return status 200 - OK', async () => {
        var response = await callRESTService({
            method: 'HEAD', 
            path: esClusterUrl + '/megacorp/employee/' + documentId
        });
        expect(response.status.code).toBe(200);
    });

    it ('a HEAD request for a nonexistent document should return status 404 - Not Found', async () => {
        var response = await callRESTService({
            method: 'HEAD', 
            path: esClusterUrl + '/megacorp/employee/' + documentId + '2'
        });
        expect(response.status.code).toBe(404);
    });

    it ('a GET request for the existing document should return status 200 - OK', async () => {
        var response = await callRESTService({
            method: 'GET', 
            path: esClusterUrl + '/megacorp/employee/' + documentId
        });
        expect(response.status.code).toBe(200);
    });
});

describe("When a single document is retrieved from elasticsearch using GET", async () => {

    var response;

    beforeAll(async () => {
        
        response = await callRESTService({
            method: 'GET', 
            path: esClusterUrl + '/megacorp/employee/' + documentId
        });
    });

    it ('the returned http status code should be 200 - OK', async () => {
        expect(response.status.code).toBe(200);
    });

    it ('the returned metadata should match that of the document', async () => {
        expect(response.entity._index).toBe('megacorp');
        expect(response.entity._type).toBe('employee');
    });

    it ('the returned document matches that stored in elasticsearch', async () => {
        expect(response.entity._source).toEqual(document);
    });

});