var es = require('./src/es');

async function main() {
  if (await es.isup({host: 'localhost:9200'})) {
    console.log('elasticsearch cluster is UP');
  } else {
    console.log('elasticsearch cluster is DOWN');
  }
} 

main();