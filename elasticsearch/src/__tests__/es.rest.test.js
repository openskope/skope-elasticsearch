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
    var id;

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

    it ('id of created document should be the id that was assigned', async () => {
        expect(response.entity._id).toBe('1')
    });

    it ('version of created document should be 1', async () => {
        expect(response.entity._version).toBe(1);
    });
});
