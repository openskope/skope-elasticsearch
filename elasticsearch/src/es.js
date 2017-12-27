var elasticsearch = require('elasticsearch');

async function isup(params) {
  try {
    var client = new elasticsearch.Client(params);
    await client.ping({ requestTimeout: 100 });
    return true;
  } catch(e) {
    return false;
  }
}

module.exports.isup = isup;
