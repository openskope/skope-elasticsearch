const es = require('../../es');
const loader = require('../../loader');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

const pathToFile = 'src/__tests__/es.loader.tests/employee1.json';
var response;

beforeAll(async () => {    
    response = await loader.indexFile(esClusterUrl, 'megacorp', 'employee', pathToFile);
});

describe("When a JSON document is read from a file and indexed", async () => {
    
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

