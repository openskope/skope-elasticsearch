const es = require('../../es');
const loader = require('../../loader');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );


describe("When a dataset document is read from a file and indexed", async () => {
    
    var response;
    beforeAll(async () => {    

        await es.deleteIndex(esClusterUrl, 'skope');
        
        response = await loader.indexDocument(esClusterUrl, 'skope', 'dataset', 
            'data/noaa-recon-19783-gdd.json');
    });

    it ('http status code should be 201 (created)', async () => {
        expect(response.status.code).toBe(201);
    });

    it ("elasticsearch result should be 'created'" , async () => {
        expect(response.entity.result).toBe("created");
    });

    it ('the metadata returned for the indexed document should be what was assigned', async () => {
        expect(response.entity._index).toBe('skope')
        expect(response.entity._type).toBe('dataset')
    });

    it ('version of indexed document should be 1', async () => {
        expect(response.entity._version).toBe(1);
    });

});
