const frisby = require('frisby');

describe("When elasticsearch is running", () => {

    it('GET / should return cluster name', function (done) {
        frisby.get('http://localhost:9200/')
        .expect('status', 200)
        .expect('json', {"cluster_name": "skope-es-cluster-dev" })
        .done(done);
    });

    it('PUT _cluster/health should return cluster name', function (done) {
        frisby.get('http://localhost:9200/_cluster/health')
        .expect('json', {"cluster_name": "skope-es-cluster-dev" })
        .done(done);
    });
});

describe("When a new document is added to elasticsearch", () => {

    it ('PUT new document should return a status of 201', function (done) {

        frisby.put('http://localhost:9200/megacorp/employee/12', {
            "first_name" : "John",
            "last_name" :  "Smith",
            "age" :        25,
            "about" :      "I love to go rock climbing",
            "interests": [ "sports", "music" ]
        })
        .expect('status', 201)
        .expect('json', {
            "_index": "megacorp",
            "_type": "employee",
            "_id": "12",
            "result": "updated"
        })
        .done(done);

        frisby.get('http://localhost:9200/megacorp/employee/12')
        .expect('status', 200)
        .expect('json', {
            "_source": {
                "first_name" : "John",
                "last_name" :  "Smith",
                "age" :        25,
                "about" :      "I love to go rock climbing",
                "interests": [ "sports", "music" ]
        }})
        .done(done);
    });
});