const es = require('../../es');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );
  
describe("When elasticsearch is running", () => {
    
    it('es.isup() function should indicate elasticsearch cluster is up', async () => {
        var clusterIsUp = await es.isup({
            host: esClusterUrl
        });
        expect(clusterIsUp).toBe(true);
    });

    it ('GET / should return cluster name', async function() {
        var response = await callRESTService({
            method: 'GET',
            path: esClusterUrl
        });
        expect(response.status.code).toBe(200);
        expect(response.entity.cluster_name).toBe("skope-es-cluster-dev");
    });

    it ('GET /_cluster/health should return cluster name', async function() {
        var response = await callRESTService({ 
            method: 'GET', 
            path: esClusterUrl + '/_cluster/health'
        });
        expect(response.status.code).toBe(200);
        expect(response.entity.cluster_name).toBe("skope-es-cluster-dev");
    });
});
