var elasticsearch = require('elasticsearch');
var fs = require('fs');
var esClient = require('./elastic-client.js')



esClient.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 1000
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
    console.log(error);
  } else {
    console.log('All is well');
  }
});

