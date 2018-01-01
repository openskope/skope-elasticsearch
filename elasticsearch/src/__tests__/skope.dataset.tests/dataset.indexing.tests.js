const es = require('../../es');
const rest = require('rest');
const mime = require('rest/interceptor/mime');

const esClusterUrl = 'http://localhost:9200';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

var response;

beforeAll(async () => {
    
    response = await callRESTService({
        method: 'POST', 
        path: esClusterUrl + '/skope/dataset/',
        entity: {
            "id"            : "noaa-recon-19783",
            "title"         : "SW USA 2000 Year Growing Degree Days and Precipitation Reconstructions",
            "authors"       : ["Bocinsky, R.K.", "Rush, J.", "Kintigh, K.W.", "Kohler, T.A."],
            "description"   : "High spatial resolution (30 arc-second) Southwestern United States tree-ring reconstructions of May-September Growing-degree Days (GDD) and Net Water-year Precipitation (previous October - current November). The reconstructions were performed using the 'PaleoCAR' method detailed in Bocinsky and Kohler (2014).",
            "citation"      : "R. Kyle Bocinsky, Johnathan Rush, Keith W. Kintigh and Timothy A. Kohler. 2016. Exploration and exploitation in the macrohistory of the pre-Hispanic Pueblo Southwest. Science Advances, 2(4), e1501532. doi: 10.1126/sciadv.1501532 ",
            "revised"       : "2016-04-01",
            "status"        : "published",
            "datatypes"     : "May-September Growing-degree Days (GDD); Net Water-year Precipitation (previous October - current November)",
            "publisher"     : "NCDC-Paleoclimatology",
            "download"      : "https://www1.ncdc.noaa.gov/pub/data/paleo/treering/reconstructions/northamerica/usa/bocinsky2016/",
            "keywords"      : ["Precipitation", "Reconstruction"],
            "variable"      : "precipitation",
            "spatial_extent"    : {
                "type"          : "envelope", 
                "coordinates"   : [ 
                    [ -115.0000, 31.0000 ],
                    [ -102.0000, 43.0000 ],
                ]
            },
            "spatialres"        : "30 arc-sec",
            "temporalext"       : "1 CE - 2000 CE",
            "temporal_extent"   : {
                "start"         : "0001-01-01",
                "end"           : "2000-01-01"
            },
            "temporalres"       :  "annual",
            "model_title"       :  "PaleoCAR",
            "layer_wms"         :  "http://localhost",
        }
    });
});

describe("When a new dataset with an automatically assigned id is added to elasticsearch", async () => {
    
    it ('http status code should be 201 (created)', async () => {
        expect(response.status.code).toBe(201);
    });

    it ("elasticsearch result should be 'created'" , async () => {
        expect(response.entity.result).toBe("created");
    });

    it ('the metadata returned for the created documented should what was assigned', async () => {
        expect(response.entity._index).toBe('skope')
        expect(response.entity._type).toBe('dataset')
    });

    it ('version of created document should be 1', async () => {
        expect(response.entity._version).toBe(1);
    });
});

