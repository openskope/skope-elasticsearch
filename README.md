# skope-elasticsearch

This repo contains scripts, tests, and other resources supporting development of the Elasticsearch service component of the SKOPE system.  It allows ES to be run independently of the other SKOPE services, provides scripts for loading the ES instance with data, and includes a framework for automatically testing each of the searches we support through the SKOPE user interface.

## Repository contents

| File or directory  | Description                                      |
| ------------------ |------------------------------------------------- |
| [docker-compose.yml](https://github.com/openskope/skope-elasticsearch/blob/master/docker-compose.yml) | A Compose file for running Elasticsearch.  Issuing the command `docker-compose up` in the top-level directory of the repo will start docker containers comprising an Elasticsearch cluster and an instance of Kibana for monitoring and manually querying Elasticsearch. |
| [package.json](https://github.com/openskope/skope-elasticsearch/blob/master/package.json) | An `npm` project file for running tests using Node.  This file declares the `npm` packages required by this project and defines simple commands for starting and stopping the test environment, running the tests, etc. |
| [src/](https://github.com/openskope/skope-elasticsearch/tree/master/src) | Directory tree containing all Javascript source files, scripts, and tests. |
| [src/\_\_tests\_\_](https://github.com/openskope/skope-elasticsearch/tree/master/src/__tests__) | Directory tree containing all tests performed when the `npm test` command is issued. |
| [src/\_\_tests\_\_/es.rest.api.tests](https://github.com/openskope/skope-elasticsearch/tree/master/src/__tests__/es.rest.api.tests) | Directory tree containing tests that exercise the Elasticsearch REST API generally. |
| [src/\_\_tests\_\_/es.dataset.tests](https://github.com/openskope/skope-elasticsearch/tree/master/src/__tests__/skope.dataset.tests) | Directory tree containing tests that exercise the mapping (metadata schema) for SKOPE datasets and the searches we support in the SKOPE user interface.

## How to run the tests

The tests in this repository are meant to run against an Elasticsearch cluster containing no useful data. The tests are destructive. They add and delete indexes and documents.  The `docker-compose.yml` file defines a set of Docker containers that run an Elasticsearch cluster against which the tests are known to pass.

### Prerequisites

Running the tests on a development system requires that you have the following software packages installed:

* Node.js
* npm
* Docker (with docker-compose)

The scripts and tests in this repo work are known to work correclty on recent versions of macOS, Wndows, and Ubuntu.

### Starting the Elasticsearch cluster

Before running the tests start the Elasticsearch cluster using `docker-compose`.  You can run `docker-compose` directly, e.g.

    $ docker-compose up

Alternatively, you can use the `start` script defined in `package.json` which issues the command above for you.

    $ npm start

Note that it may take several minutes fo the ES cluster to start up.

To shut down the ES cluster issue either the `docker-compose down` or `npm stop` command in a different terminal.  You can restart the ES cluster with the `npm restart` command.  This is equivalent to `npm stop` followed by `npm start`.

### Running the tests

With the Elasticsearch cluster running you can perform all of the tests by issuing the `npm test` command in the top directory of the repo. If the tests pass you will seem something like this:

    $ npm test

    > jest --watchAll --runInBand

    PASS  src\__tests__\es.rest.api.tests\es.mapping.tests.js
    PASS  src\__tests__\es.rest.api.tests\es.searching.tests.js
    PASS  src\__tests__\skope.dataset.tests\dataset.loading.tests.js
    PASS  src\__tests__\skope.dataset.tests\dataset.mapping.tests.js
    PASS  src\__tests__\skope.dataset.tests\dataset.indexing.tests.js
    PASS  src\__tests__\es.rest.api.tests\es.retrieving.tests.js
    PASS  src\__tests__\es.rest.api.tests\es.indexing.tests.js
    PASS  src\__tests__\es.rest.api.tests\es.loading.tests.js
    PASS  src\__tests__\es.rest.api.tests\es.monitoring.tests.js

    Test Suites: 9 passed, 9 total
    Tests:       64 passed, 64 total
    Snapshots:   0 total
    Time:        22.941s
    Ran all test suites.

    Watch Usage: Press w to show more.

If any of the tests fail, details highlighting the failure(s) will be displayed. For example,

    PASS  src\__tests__\es.rest.api.tests\es.mapping.tests.js (7.232s)
    PASS  src\__tests__\es.rest.api.tests\es.searching.tests.js
    PASS  src\__tests__\skope.dataset.tests\dataset.mapping.tests.js
    PASS  src\__tests__\skope.dataset.tests\dataset.loading.tests.js
    PASS  src\__tests__\skope.dataset.tests\dataset.indexing.tests.js
    PASS  src\__tests__\es.rest.api.tests\es.retrieving.tests.js
    FAIL  src\__tests__\es.rest.api.tests\es.indexing.tests.js
    ● When a new document with an automatically assigned id is added to elasticsearch › http status code should be 201 (created)

       expect(received).toBe(expected)

       Expected value to be (using ===):
         200
       Received:
         201

         at Object.it (src/__tests__/es.rest.api.tests/es.indexing.tests.js:29:38)
             at new Promise (<anonymous>)
             at <anonymous>
         at process._tickCallback (internal/process/next_tick.js:188:7)

    PASS  src\__tests__\es.rest.api.tests\es.loading.tests.js
    PASS  src\__tests__\es.rest.api.tests\es.monitoring.tests.js
    
    Test Suites: 1 failed, 8 passed, 9 total
    Tests:       1 failed, 63 passed, 64 total
    Snapshots:   0 total
    Time:        20.826s, estimated 21s
    Ran all test suites.

### Rerunning the tests

The test runner is configured to remain active following each execution of the tests.  You can request that the tests be performed again by pressing the `a` key.  The tests also will run automatically each time any of the test files are changed. 
