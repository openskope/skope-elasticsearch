const es = require('../../es');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

var response;

beforeAll(async () => {
    
    response = await callRESTService({
        method: 'POST', 
        path: esClusterUrl + '/megacorp/employee/',
        entity: {
            "first_name" : "John",
            "last_name" :  "Smith",
            "age" :        25,
            "about" :      "I love to go rock climbing",
            "interests": [ "sports", "music" ]
        }
    });
});

describe("When a new document with an automatically assigned id is added to elasticsearch", async () => {
    
    it ('http status code should be 201 (created)', async () => {
        expect(response.status.code).toBe(201);
    });

    it ("elasticsearch result should be 'created'" , async () => {
        expect(response.entity.result).toBe("created");
    });

    it ('the metadata returned for the created documented should what was assigned', async () => {
        expect(response.entity._index).toBe('megacorp')
        expect(response.entity._type).toBe('employee')
    });

    it ('version of created document should be 1', async () => {
        expect(response.entity._version).toBe(1);
    });
});

