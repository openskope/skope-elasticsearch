const es = require('../../es');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

beforeAll(async () => {
    
    await es.deleteIndex(esClusterUrl, 'time');
    
    await callRESTService({
        method: 'PUT', 
        path: esClusterUrl + '/time',
        entity: {
            "mappings": {
                "range":  {
                    "properties": {
                        "start": {  "type": "date", "format": "yyyy-MM-dd" },
                        "end":   {  "type": "date", "format": "yyyy-MM-dd" }
                    }
                },
            }
        }
    });
});

describe("When both ends of a date range are within the unix epoch", async () => {

    const rangeInEpoch = {
        "period" : {
            "start"           : "1971-01-01",
            "end"             : "2001-01-01"
        }
    };

    var postResponse;
    var getResponse;
    var searchResponse;
    var hits;

    beforeAll(async () => {

        postResponse = await callRESTService({
            method: 'POST', 
            path: esClusterUrl + '/time/range/1',
            entity: rangeInEpoch 
        });

        await es.refreshAll(esClusterUrl);

        getResponse = await callRESTService({
            method: 'GET', 
            path: esClusterUrl + '/time/range/1'
        });

    });

    it ('the returned post status code should be 201 - created', async () => {
        expect(postResponse.status.code).toBe(201);
    });

    it ('the returned get status code should be 200 - ok', async () => {
        expect(getResponse.status.code).toBe(200);
    });

    it ('the returned data range matches that stored in elasticsearch', async () => {
        expect(getResponse.entity._source).toEqual(rangeInEpoch);
    });

    it ('the total number of search hits should be 1', async () => {

        searchResponse = await callRESTService({
            method: 'GET',
            path: esClusterUrl + '/time/range/_search',
            entity: {
                "query" : {
                    "range" : {
                        "period.start" : { 
                            "gte" : "1970-01-01"
                        } 
                    }
                },
            }

        });

        hits = searchResponse.entity.hits.hits;

        expect(searchResponse.status.code).toBe(200);
        expect(searchResponse.entity.hits.total).toBe(1);
        expect(hits[0]._source).toEqual(rangeInEpoch);
    });

});

describe("When start date range precedes the unix epoch", async () => {

    const rangeThatStartsBeforeEpoch = {
        "period" : {
            "start"           : "1969-01-01",
            "end"             : "2000-01-01"
        }
    };

    var postResponse;
    var getResponse;

    beforeAll(async () => {

        postResponse = await callRESTService({
            method: 'POST', 
            path: esClusterUrl + '/time/range/2',
            entity: rangeThatStartsBeforeEpoch 
        });

        await es.refreshAll(esClusterUrl);

        getResponse = await callRESTService({
            method: 'GET', 
            path: esClusterUrl + '/time/range/2'
        });
    });

    it ('the returned post status code should be 201 - created', async () => {
        expect(postResponse.status.code).toBe(201);
    });

    it ('the returned get status code should be 200 - ok', async () => {
        expect(getResponse.status.code).toBe(200);
    });

    it ('the returned data range matches that stored in elasticsearch', async () => {
        expect(getResponse.entity._source).toEqual(rangeThatStartsBeforeEpoch);
    });

});

describe("When date range ends before the unix epoch", async () => {

    const rangeThatEndsBeforeEpoch = {
        "period" : {
            "start"           : "0001-01-01",
            "end"             : "1001-01-01"
        }
    };

    var postResponse;
    var getResponse;

    beforeAll(async () => {

        postResponse = await callRESTService({
            method: 'POST', 
            path: esClusterUrl + '/time/range/3',
            entity: rangeThatEndsBeforeEpoch 
        });

        await es.refreshAll(esClusterUrl);

        getResponse = await callRESTService({
            method: 'GET', 
            path: esClusterUrl + '/time/range/3'
        });
    });

    it ('the returned post status code should be 201 - created', async () => {
        expect(postResponse.status.code).toBe(201);
    });

    it ('the returned get status code should be 200 - ok', async () => {
        expect(getResponse.status.code).toBe(200);
    });

    it ('the returned data range matches that stored in elasticsearch', async () => {
        expect(getResponse.entity._source).toEqual(rangeThatEndsBeforeEpoch);
    });

});