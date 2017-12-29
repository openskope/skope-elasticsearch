const es = require('../es');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

describe("When elasticsearch is running", () => {
    
    it('es.isup() function should indicate elasticsearch cluster is up', async () => {
        var clusterIsUp = await es.isup({
            host: esClusterUrl
        });
        expect(clusterIsUp).toBe(true);
    });

    it ('GET / should return cluster name', async function() {
        var response = await callRESTService({
            method: 'GET',
            path: esClusterUrl
        });
        expect(response.status.code).toBe(200);
        expect(response.entity.cluster_name).toBe("skope-es-cluster-dev");
    });

    it ('GET /_cluster/health should return cluster name', async function() {
        var response = await callRESTService({ 
            method: 'GET', 
            path: esClusterUrl + '/_cluster/health'
        });
        expect(response.status.code).toBe(200);
        expect(response.entity.cluster_name).toBe("skope-es-cluster-dev");
    });
});

describe("When a new document with a specified id is added to elasticsearch", async () => {
    
    var response;

    beforeAll(async () => {
        
       await es.deleteIndex(esClusterUrl, 'megacorp');

        response = await callRESTService({
            method: 'POST', 
            path: esClusterUrl + '/megacorp/employee/1',
            entity: {
                "first_name" : "John",
                "last_name" :  "Smith",
                "age" :        25,
                "about" :      "I love to go rock climbing",
                "interests": [ "sports", "music" ]
            }
        });
    });

    it ('http status code should be 201 (created)', async () => {
        expect(response.status.code).toBe(201);
    });

    it ("elasticsearch result should be 'created'" , async () => {
        expect(response.entity.result).toBe("created");
    });

    it ('the metadata returned for the created documented should what was assigned', async () => {
        expect(response.entity._index).toBe('megacorp')
        expect(response.entity._type).toBe('employee')
        expect(response.entity._id).toBe('1')
    });

    it ('version of created document should be 1', async () => {
        expect(response.entity._version).toBe(1);
    });
});

describe("When a document exists in elasticsearch", async () => {
    
    beforeAll(async () => {

        await es.deleteIndex(esClusterUrl, 'megacorp');

        await callRESTService({
            method: 'POST', 
            path: esClusterUrl + '/megacorp/employee/1',
            entity: {
                "first_name" : "John",
                "last_name" :  "Smith",
                "age" :        25,
                "about" :      "I love to go rock climbing",
                "interests": [ "sports", "music" ]
            }
        });

        await es.refreshAll(esClusterUrl);
    });

    it ('a HEAD request for the document should return status 200 - OK', async () => {
        var response = await callRESTService({
            method: 'HEAD', 
            path: esClusterUrl + '/megacorp/employee/1'
        });
        expect(response.status.code).toBe(200);
    });

    it ('a HEAD request for a nonexistent document should return status 404 - Not Found', async () => {
        var response = await callRESTService({
            method: 'HEAD', 
            path: esClusterUrl + '/megacorp/employee/2'
        });
        expect(response.status.code).toBe(404);
    });

    it ('a GET request for the existing document should return status 200 - OK', async () => {
        var response = await callRESTService({
            method: 'GET', 
            path: esClusterUrl + '/megacorp/employee/1'
        });
        expect(response.status.code).toBe(200);
    });
});

describe("When a single document is retrieved from elasticsearch using GET", async () => {
    var response;

    var document = {
        "first_name" : "John",
        "last_name" :  "Smith",
        "age" :        25,
        "about" :      "I love to go rock climbing",
        "interests": [ "sports", "music" ]
    };

    beforeAll(async () => {
        
        await es.deleteIndex(esClusterUrl, 'megacorp');

        await callRESTService({
            method: 'POST', 
            path: esClusterUrl + '/megacorp/employee/1',
            entity: document
        });

        await es.refreshAll(esClusterUrl);

        response = await callRESTService({
            method: 'GET', 
            path: esClusterUrl + '/megacorp/employee/1'
        });
    });

    it ('the returned http status code should be 200 - OK', async () => {
        expect(response.status.code).toBe(200);
    });

    it ('the returned metadata should match that of the document', async () => {
        expect(response.entity._index).toBe('megacorp');
        expect(response.entity._type).toBe('employee');
        expect(response.entity._id).toBe('1');
    });

    it ('the returned document matches that stored in elasticsearch', async () => {
        expect(response.entity._source).toEqual(document);
    });

});
    