const es = require('../../es');
const loader = require('../../loader');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

var response;

beforeAll(async () => {
    
    const jsonDocument = loader.loadJsonFromFile('data/noaa-recon-19783-gdd.json');

    response = await callRESTService({
        method: 'POST', 
        path: esClusterUrl + '/skope/dataset/',
        entity: jsonDocument
    });
});

describe("When a new dataset with an automatically assigned id is added to elasticsearch", async () => {
    
    it ('http status code should be 201 (created)', async () => {
        expect(response.status.code).toBe(201);
    });

    it ("elasticsearch result should be 'created'" , async () => {
        expect(response.entity.result).toBe("created");
    });

    it ('the metadata returned for the created documented should what was assigned', async () => {
        expect(response.entity._index).toBe('skope')
        expect(response.entity._type).toBe('dataset')
    });

    it ('version of created document should be 1', async () => {
        expect(response.entity._version).toBe(1);
    });
});

