const es = require('../../es');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

var document = [{
        "first_name" : "John",
        "last_name" :  "Smith",
        "age" :        25,
        "about" :      "I love to go rock climbing",
        "interests": [ "sports", "music" ]
    }, {
        "first_name" :  "Jane",
        "last_name" :   "Smith",
        "age" :         32,
        "about" :       "I like to collect rock albums",
        "interests":  [ "music" ]
    }, {
        "first_name" :  "Douglas",
        "last_name" :   "Fir",
        "age" :         35,
        "about":        "I like to build cabinets",
        "interests":  [ "forestry" ]
    }
];

beforeAll(async () => {
    
    await es.deleteIndex(esClusterUrl, 'megacorp');
    
    await callRESTService({
        method: 'POST', 
        path: esClusterUrl + '/megacorp/employee/0',
        entity: document[0]
    });

    await es.refreshAll(esClusterUrl);
    
});

describe("When a single document is found via search for all documents in an index", async () => {
    
    var response;

    beforeAll(async () => {
        
        response = await callRESTService({
            method: 'GET',
            path: esClusterUrl + '/megacorp/_search'
        });
    });

    it ('the returned http status code should be 200 - OK', async () => {
        expect(response.status.code).toBe(200);
    });

    it ('the total number of search hits should be 1', async () => {
        expect(response.entity.hits.total).toBe(1);
    });

    it ('the maximum score of the search hits should be 1', async () => {
        expect(response.entity.hits.max_score).toBe(1);
    });

    it ('the score of the single hit should be 1', async () => {
        expect(response.entity.hits.hits[0]._score).toBe(1);
    });

    it ('the returned metadata for the single hit should match that of the document', async () => {
        expect(response.entity.hits.hits[0]._index).toBe('megacorp');
        expect(response.entity.hits.hits[0]._type).toBe('employee');
        expect(response.entity.hits.hits[0]._id).toBe('0');
    });

    it ('the returned document matches that stored in elasticsearch', async () => {
        expect(response.entity.hits.hits[0]._source).toEqual(document[0]);
    });

});

describe("When 3 documents are found via search for all documents in an index", async () => {
    
    var response;

    beforeAll(async () => {

        for (var id = 1; id <= 2; ++id) {
            await callRESTService({
                method: 'POST', 
                path: esClusterUrl + '/megacorp/employee/' + id,
                entity: document[id]
            });
        };

        await es.refreshAll(esClusterUrl);

        response = await callRESTService({
            method: 'GET',
            path: esClusterUrl + '/megacorp/_search'
        });
    });

    it ('the returned http status code should be 200 - OK', async () => {
        expect(response.status.code).toBe(200);
    });

    it ('the total number of search hits should be 3', async () => {
        expect(response.entity.hits.total).toBe(3);
    });

    it ('the maximum score of the search hits should be 1', async () => {
        expect(response.entity.hits.max_score).toBe(1);
    });

    it ('the score of each hit should be 1', async () => {
        [0,1,2].map( (i) => {
            expect(response.entity.hits.hits[i]._score).toBe(1);
        });
    });

});

describe("When 2 documents are found via full text search of one field", async () => {
    
    var response;
    var hits;
    
    beforeAll(async () => {

        response = await callRESTService({
            method: 'GET',
            path: esClusterUrl + '/megacorp/_search',
            entity: {
                "query" : {
                    "match" : {
                        "last_name" : "Smith"
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

    it ('the ids of the two returned documents are those of the matching documents', async () => {
        expect([hits[0]._id, hits[1]._id]).toEqual(expect.arrayContaining(['0','1']));
    });

    it ('the two matching documents are returned in the hits', async () => {
        expect([hits[0]._source, hits[1]._source]).toEqual(expect.arrayContaining([document[0],document[1]]));
    });

});

describe("When 2 documents is found via search with a filter", async () => {
    
    var response;
    var hits;

    beforeAll(async () => {

        response = await callRESTService({
            method: 'GET',
            path: esClusterUrl + '/megacorp/_search',
            entity: {
                "query" : {
                    "bool" : {
                        "filter" : {
                            "range" : {
                                "age" : { "gt" : 30 } 
                            }
                        },
                        "must": {
                            "match_all" : {}
                        }    
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

    it ('the ids of the two documents are those expected', async () => {
        expect([hits[0]._id, hits[1]._id]).toEqual(expect.arrayContaining(['1','2']));
    });

    it ('the two matching documents are returned in the hits', async () => {
        expect([hits[0]._source, hits[1]._source]).toEqual(expect.arrayContaining([document[1],document[2]]));
    });

});

describe("When 1 document is found via compound search of a match and a filter", async () => {
    
    var response;
    var hits;

    beforeAll(async () => {

        response = await callRESTService({
            method: 'GET',
            path: esClusterUrl + '/megacorp/_search',
            entity: {
                "query" : {
                    "bool" : {
                        "filter" : {
                            "range" : {
                                "age" : { "gt" : 30 } 
                            }
                        },
                        "must": {
                            "match" : {
                                "last_name" : "Smith"
                            }
                        }    
                    }
                }
            }
        });

        hits = response.entity.hits.hits;        
    });

    it ('the returned http status code is 200 (OK)', async () => {
        expect(response.status.code).toBe(200);
    });

    it ('the total number of search hits is 1', async () => {
        expect(response.entity.hits.total).toBe(1);
    });

    it ('the id is that of the matching document', async () => {
        expect(response.entity.hits.hits[0]._id).toBe('1');
    });

    it ('the returned document matches that stored in elasticsearch', async () => {
        expect(response.entity.hits.hits[0]._source).toEqual(document[1]);
    });

});