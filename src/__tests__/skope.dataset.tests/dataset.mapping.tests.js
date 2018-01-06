const es = require('../../es');
const loader = require('../../loader');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

var mappingPutResponse;
var mappingGetResponse;
var datasetMappingJson;
var indexingResponse;

beforeAll(async () => {
    
    await es.deleteIndex(esClusterUrl, 'skope');
    
    datasetMappingJson = loader.loadJsonFromFile(
        'skope.dataset.mapping.json');

    mappingPutResponse = await callRESTService({
        method: 'PUT', 
        path: esClusterUrl + '/skope',
        entity: datasetMappingJson
    });

    mappingGetResponse = await callRESTService({
        method: 'GET', 
        path: esClusterUrl + '/skope/_mapping/dataset/'
    });

    indexingResponse = await loader.indexDocument(esClusterUrl, 'skope', 'dataset', 
        'src/__tests__/skope.dataset.tests/data/noaa-recon-19783-gdd.json');
});        

describe("When an explicit mapping is created and retrieved ", async () => {
    
    it ('the http status code for the mapping PUT request is 200 (ok)', async () => {
        expect(mappingPutResponse.status.code).toBe(200);
    });

    it ('the http status code for the mapping GET request is 200 (ok)', async () => {
        expect(mappingGetResponse.status.code).toBe(200);
    });

    it ('a single mapping is returned', async () => {
        expect(Object.keys(mappingGetResponse.entity.skope.mappings).length).toBe(1);
    });

    it ('the mapping returned by GET matches that assigned by PUT', async () => {
        expect(mappingGetResponse.entity.skope).toEqual( datasetMappingJson );
    });

});

describe("When a dataset document is indexed after the mapping is created", async () => {

    it ('http status code should be 201 (created)', async () => {
        expect(indexingResponse.status.code).toBe(201);
    });

    it ("elasticsearch result should be 'created'" , async () => {
        expect(indexingResponse.entity.result).toBe("created");
    });

    it ('the metadata returned for the indexed document should be what was assigned', async () => {
        expect(indexingResponse.entity._index).toBe('skope')
        expect(indexingResponse.entity._type).toBe('dataset')
    });

    it ('version of indexed document should be 1', async () => {
        expect(indexingResponse.entity._version).toBe(1);
    });

});