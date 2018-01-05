var es = require('./es');

async function main() {
  if (await es.isup({host: 'localhost:9200'})) {
    console.log('The test elasticsearch cluster is UP');
  } else {
    console.log('The test elasticsearch cluster is DOWN');
  }
} 

main();