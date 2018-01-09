const es = require('../../es');
const loader = require('../../loader');
const glob = require('glob');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

beforeAll(async () => {
    
    await es.deleteIndex(esClusterUrl, 'skope');
    
    var datasetMappingJson = loader.loadJsonFromFile('skope.dataset.mapping.json');

    await callRESTService({
        method: 'PUT', 
        path: esClusterUrl + '/skope',
        entity: datasetMappingJson
    });

    var documents = glob.sync('data/*.json');
    for (var i = 0; i < documents.length; i += 1) {
        const jsonDocument = loader.loadJsonFromFile(documents[i]);
        await callRESTService({
            method: 'POST', 
            path: esClusterUrl + '/skope/dataset/',
            entity: jsonDocument
        });    
    }

    await es.refreshAll(esClusterUrl);
});

describe("When all datasets are found via search", async () => {
    
    var response;

    beforeAll(async () => {
        
        response = await callRESTService({
            method: 'GET',
            path: esClusterUrl + '/skope/_search'
        });
    });

    it ('the returned http status code should be 200 - OK', async () => {
        expect(response.status.code).toBe(200);
    });

    it ('the total number of search hits should be 2', async () => {
        expect(response.entity.hits.total).toBe(2);
    });

    it ('the maximum score of the search hits should be 1', async () => {
        expect(response.entity.hits.max_score).toBe(1);
    });

    it ('the score of each hit should be 1', async () => {
        for (var i = 0; i < 2; i += 1) {
            expect(response.entity.hits.hits[i]._score).toBe(1);
        }
    });

});

