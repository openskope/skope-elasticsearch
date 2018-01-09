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

describe("When all datasets are found via search for all documents in the index", async () => {
    
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
        for (var i = 0; i < response.entity.hits.total; i += 1) {
            expect(response.entity.hits.hits[i]._score).toBe(1);
        }
    });

});

describe("When 2 documents are found via full text search of study.id field", async () => {
    
    var response;
    var hits;
    
    beforeAll(async () => {

        response = await callRESTService({
            method: 'GET',
            path: esClusterUrl + '/skope/_search',
            entity: {
                "query" : {
                    "match" : {
                        "study.id" : "19783"
                    }
                }
            }
        });

        hits = response.entity.hits.hits;
    });

    it ('the returned http status code should be 200 - OK', async () => {
        expect(response.status.code).toBe(200);
    });

    it ('the total number of search hits should be 2', async () => {
        expect(response.entity.hits.total).toBe(2);
    });
});

describe("When documents are searched by model.nickname keyword field", async () => {
    
    var matchingSearchResponse;
    var nonMatchingSearchResponse;
    var hits;
    
    beforeAll(async () => {

        matchingSearchResponse = await callRESTService({
            method: 'GET',
            path: esClusterUrl + '/skope/_search',
            entity: {
                "query" : {
                    "match" : {
                        "model.nickname" : "PaleoCAR"
                    }
                }
            }
        });

        nonMatchingSearchResponse = await callRESTService({
            method: 'GET',
            path: esClusterUrl + '/skope/_search',
            entity: {
                "query" : {
                    "match" : {
                        "model.nickname" : "PaleoCA"
                    }
                }
            }
        });

    });

    it ('the returned http status codes should be 200 - OK', async () => {
        expect(matchingSearchResponse.status.code).toBe(200);
        expect(nonMatchingSearchResponse.status.code).toBe(200);
    });

    it ('the total number of search hits should be 2', async () => {
        expect(matchingSearchResponse.entity.hits.total).toBe(2);
        expect(nonMatchingSearchResponse.entity.hits.total).toBe(0);
    });

});

