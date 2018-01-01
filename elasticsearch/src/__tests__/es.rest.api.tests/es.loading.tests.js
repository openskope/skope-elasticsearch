const es = require('../../es');
const loader = require('../../loader');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );


describe("When a JSON document is read from a file and indexed", async () => {
    
    var response;
    beforeAll(async () => {    
        response = await loader.indexFile(esClusterUrl, 'megacorp', 'employee', 
            'src/__tests__/es.rest.api.tests/data/employee1.json');
    });

    it ('http status code should be 201 (created)', async () => {
        expect(response.status.code).toBe(201);
    });

    it ("elasticsearch result should be 'created'" , async () => {
        expect(response.entity.result).toBe("created");
    });

    it ('the metadata returned for the indexed document should be what was assigned', async () => {
        expect(response.entity._index).toBe('megacorp')
        expect(response.entity._type).toBe('employee')
    });

    it ('version of indexed document should be 1', async () => {
        expect(response.entity._version).toBe(1);
    });

});

describe("When a JSON file cannot be found", async () => {
    
    it ('http status code should be 201 (created)', async () => {
        try { 
            await loader.indexFile(esClusterUrl, 'megacorp', 'employee', 
                'nonexistent.json');
        } catch(e) {
            expect(e).toBe("File 'nonexistent.json' could not be read.");
        }
    });

});


describe("When a malformed JSON file is read", async () => {
    
    it ('http status code should be 201 (created)', async () => {
        var exception;
        try { 
            await loader.indexFile(esClusterUrl, 'megacorp', 'employee', 
                'src/__tests__/es.rest.api.tests/data/malformed.json');
            fail();
        } catch(e) {
            exception = e;
        }
        expect(exception.message).toBe('Error parsing JSON document');
        expect(exception.details).toBe('Unexpected token , in JSON at position 50');
    });

});
