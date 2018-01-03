const es = require('../../es');
const loader = require('../../loader');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

describe("When an implicitly created mapping is retrieved ", async () => {

    var response;

    beforeAll(async () => {
        
        await es.deleteIndex(esClusterUrl, 'skope');
        
        response = await loader.indexDocument(esClusterUrl, 'skope', 'dataset', 
            'src/__tests__/skope.dataset.tests/data/noaa-recon-19783-gdd.json');

        await es.refreshAll(esClusterUrl);
    
        response = await callRESTService({
            method: 'GET', 
            path: esClusterUrl + '/skope/_mapping/dataset/'
        });
    });

    it ('the http status code is 200 (ok)', async () => {
        expect(response.status.code).toBe(200);
    });

    it ('a single mapping is returned', async () => {
        expect(Object.keys(response.entity.skope.mappings).length).toBe(1);
    });

});

describe("When an explicit mapping is created and retrieved ", async () => {
    
    var mappingPutResponse;
    var mappingGetResponse;

    beforeAll(async () => {
        
        await es.deleteIndex(esClusterUrl, 'skope');
        
        const mappings = loader.loadJsonFromFile(
            'src/__tests__/skope.dataset.tests/data/skope.dataset.mapping.json');

        mappingPutResponse = await callRESTService({
            method: 'PUT', 
            path: esClusterUrl + '/skope',
            entity: {
                "mappings": mappings
            }
        });

        mappingGetResponse = await callRESTService({
            method: 'GET', 
            path: esClusterUrl + '/skope/_mapping/dataset/'
        });
    });        

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
        expect(mappingGetResponse.entity.skope.mappings.dataset).toEqual( {
            "properties": {
                    "study": {
                        "type": "text"
                    },
                    "revised": {
                        "type": "text"
                    },
                    "status": {
                        "type": "text"
                    },
                    "datatypes": {
                        "type": "text"
                    },
                    "publisher": {
                        "type": "text"
                    },
                    "download": {
                        "type": "text"
                    },
                    "keywords": {
                        "type": "text"
                    },
                    "variable": {
                        "type": "text"
                    },
                    "spatial_extent": {
                        "type": "text"
                    },
                    "spatialres": {
                        "type": "text"
                    },
                    "temporalext": {
                        "type": "text"
                    },
                    "temporal_extent": {
                        "type": "text"
                    },
                    "temporalres": {
                        "type": "text"
                    },
                    "model_title": {
                        "type": "text"
                    },
                    "layer_wms": {
                        "type": "text"
                    }
                }
        });
    });

});

