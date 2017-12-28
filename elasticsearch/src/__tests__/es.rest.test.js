const es = require('../es');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

function getRestClient() {
    return rest.wrap(mime, { mime: 'application/json' } );
}

describe("When elasticsearch is running", () => {

    var client = getRestClient();

    it('es.isup() function should indicate elasticsearch cluster is up', async () => {
        expect(
            await es.isup({host: 'localhost:9200'})
        ).toBe(true);
    });

    it ('GET / should return cluster name', async function() {
        var response = await client({ method: 'GET', path: 'http://localhost:9200/' });
        expect(response.status.code).toBe(200);
        expect(response.entity.cluster_name).toBe("skope-es-cluster-dev");
    });

    it ('GET /_cluster/health should return cluster name', async function() {
        var response = await client({ method: 'GET', path: 'http://localhost:9200/_cluster/health' });
        expect(response.status.code).toBe(200);
        expect(response.entity.cluster_name).toBe("skope-es-cluster-dev");
    });

});

describe("When a new document with a specified id is added to elasticsearch", async () => {

    var client = getRestClient();
    var response;
    var id;

    beforeAll(async () => {

       await es.deleteIndex('http://localhost:9200', 'megacorp');

        response = await client({
            method: 'POST', 
            path: 'http://localhost:9200/megacorp/employee/1',
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
