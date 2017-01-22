import * as d3 from 'd3';

var loader = {}

loader.init = function(cb) {
  var q = d3.queue();
  q.defer(load, "data/csv/coins.csv");
  q.await(function(error, data) {
    if(error) throw error;
    cb(data);
  })
}

function load(url, callback) {
  d3.csv(url, parseNumbers, function(err, data) {
    callback(null, data);
  });
}

function parseNumbers(d) {
  return {
    id: d.id,
    dateEarliest: parseInt(d.date_earliest),
    dateLatest: parseInt(d.date_latest),
    productionCountry: d.production_country,
    productionMintingPlace: d.production_minting_place,
    productionRegion: d.production_region,
    title: d.title
  }
}

export default loader;