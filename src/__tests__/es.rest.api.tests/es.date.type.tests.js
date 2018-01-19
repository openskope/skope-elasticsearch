const es = require('../../es');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

beforeAll(async () => {
    
    await es.deleteIndex(esClusterUrl, 'time');
    
    await callRESTService({
        method: 'POST', 
        path: esClusterUrl + '/time/range/',
        entity: {
            "period":  {
                "properties": {
                    "start": {  "type": "date", "format": "yyyy-MM-dd" },
                    "end":   {  "type": "date", "format": "yyyy-MM-dd" }
                }
            },
        } 
    });
});

describe("When both ends of a date range are within the unix epoch", async () => {

    const rangeInEpoch = {
        "period" : {
            "start"           : "1970-01-01",
            "end"             : "2000-01-01"
        }
    };

    var postResponse;
    var getResponse;

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

});
