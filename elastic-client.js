var elasticsearch = require('elasticsearch');
var auth = require('./elasticAuthorisation.json');

module.exports = (function() {
	var esClient = new elasticsearch.Client({
	  host: auth['user'] + ':' + auth['password'] + '@localhost:9200',
	  log: 'error'
	});
	return esClient;
})();
