const es = require('../../es');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

describe("When an implicitly created mapping is retrieved ", async () => {

    var response;

    beforeAll(async () => {
        
        await es.deleteIndex(esClusterUrl, 'megacorp');
        
        await callRESTService({
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

        response = await callRESTService({
            method: 'GET', 
            path: esClusterUrl + '/megacorp/_mapping/employee/'
        });
    });

    it ('the http status code is 200 (ok)', async () => {
        expect(response.status.code).toBe(200);
    });

    it ('a single mapping is returned', async () => {
        expect(Object.keys(response.entity.megacorp.mappings).length).toBe(1);
    });

    it ('the mapping returned reflects the types of the fields in the document', async () => {
        expect(response.entity.megacorp.mappings.employee).toEqual({
            "properties": {
                "about": {
                    "type": "text", 
                    "fields": { "keyword": { "ignore_above": 256, "type": "keyword"}}
                },
                "age": {
                    "type": "long" 
                }, 
                "first_name": {
                    "type": "text",
                    "fields": {"keyword": {"ignore_above": 256, "type": "keyword"}}
                }, 
                "interests": {
                    "type": "text",
                    "fields": {"keyword": {"ignore_above": 256, "type": "keyword"}}
                }, 
                "last_name": {
                    "type": "text",
                    "fields": {"keyword": {"ignore_above": 256, "type": "keyword"}}
                }
            }
        });
    });
});

describe("When an explicit mapping is created and retrieved ", async () => {
    
    var mappingPutResponse;
    var mappingGetResponse;

    beforeAll(async () => {
        
        await es.deleteIndex(esClusterUrl, 'megacorp');
        
        mappingPutResponse = await callRESTService({
            method: 'PUT', 
            path: esClusterUrl + '/megacorp',
            entity: {
                "mappings": {
                    "employee" : {
                        "properties": {
                            "about": {
                                "type": "text"
                            },
                            "age": {
                                "type": "text" 
                            }, 
                            "first_name": {
                                "type": "text",
                            }, 
                            "interests": {
                                "type": "text",
                            }, 
                            "last_name": {
                                "type": "text",
                            }
                        }
                    }
                }
            }
        });

        mappingGetResponse = await callRESTService({
            method: 'GET', 
            path: esClusterUrl + '/megacorp/_mapping/employee/'
        });
    });        

    it ('the http status code for the mapping PUT request is 200 (ok)', async () => {
        expect(mappingPutResponse.status.code).toBe(200);
    });

    it ('the http status code for the mapping GET request is 200 (ok)', async () => {
        expect(mappingGetResponse.status.code).toBe(200);
    });

    it ('a single mapping is returned', async () => {
        expect(Object.keys(mappingGetResponse.entity.megacorp.mappings).length).toBe(1);
    });

    it ('the mapping returned by GET matches that assigned by PUT', async () => {
        expect(mappingGetResponse.entity.megacorp.mappings.employee).toEqual({
            "properties": {
                "about": {
                    "type": "text"
                },
                "age": {
                    "type": "text"
                },
                "first_name": {
                    "type": "text"
                }, 
                "interests": {
                    "type": "text"
                }, 
                "last_name": {
                    "type": "text"
                }
            }
        });
    });

});

