var elasticsearch = require('elasticsearch');
var auth = require('./elasticAuthorisation.json');

module.exports = (function()  {
	var connectionString = auth['user']+ ':' + auth['password'];
	connectionString = connectionString + '@localhost:9200';
	var esClient = new elasticsearch.Client({
	  host: connectionString,
	  log: 'error'
	});
	return esClient;
})();
