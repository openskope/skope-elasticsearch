var elasticsearch = require('elasticsearch');

async function isup() {
  try {
    var client = new elasticsearch.Client({
      host: 'localhost:9200'
    });
    await client.ping({ requestTimeout: 100 });
    return true;
  } catch(e) {
    return false;
  }
}

async function main() {
  if (await isup()) {
    console.log('elasticsearch cluster is UP');
  } else {
    console.log('elasticsearch cluster is DOWN');
  }
} 

main();