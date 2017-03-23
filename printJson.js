var fs = require("fs")
var auth = require("../elasticAuthorisation.json")
var json;

console.log(auth);

fs.readFile('dump/github/json/pull_requests.json', 'utf-8', function(err, data) {
	if (err) {
		console.log(err);
	}

	json = JSON.parse(data);
	console.log(json)
});
