var elasticsearch = require('elasticsearch');
var esClient = require('./elastic-client');

const indices = function indices() {
  return esClient.cat.indices({v: true})
  .then(console.log)
  .catch(err => console.error(`Error connecting to the es client: ${err}`));
};

//esClient.ping({
  // ping usually has a 3000ms timeout
//  requestTimeout: 1000
//}, function (error) {
//  if (error) {
//    console.trace('elasticsearch cluster is down!');
//  } else {
//    console.log('All is well');
//  }
//});
