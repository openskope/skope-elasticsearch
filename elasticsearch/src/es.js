const elasticsearch = require('elasticsearch');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

async function isup(params) {
  try {
    var client = new elasticsearch.Client(params);
    await client.ping({ requestTimeout: 1000 });
    return true;
  } catch(e) {
    return false;
  }
}

async function refreshAll(host) {
  await callRESTService({
      method: 'POST',
      path: host + '/_refresh'            
  });
}

async function indexExists(host, index) {
  var response = await callRESTService({
      method: 'GET',
      path: host + "/" + index
  });
  return response.status.code == 200;
}

async function deleteIndex(host, index) {
    await callRESTService({
        method: 'DELETE',
        path:  host + "/" + index
    });
    refreshAll(host);
    while (await indexExists(host, index));
}

module.exports.deleteIndex = deleteIndex;
module.exports.isup = isup;
module.exports.refreshAll = refreshAll;
