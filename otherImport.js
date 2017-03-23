var elasticsearch = require('elasticsearch');
var fs = require('fs');
var esClient = require('./elastic-client.js');

const bulkIndex = function bulkIndex(index, type, data) {
  var bulkBody = [];

//  data.forEach(item => {
//    bulkBody.push({
//      index: {
//        _index: index,
//        _type: type,
//        _id: item.id
//      }
//    });
	console.log(data);
	bulkBody.push({
		index: {
			_index: index,
			_type: type,
			_id: '26532195'
		}
	});
    bulkBody.push(data);
  
console.log(bulkBody);
  esClient.bulk({body: bulkBody})
  .then(response => {
    var errorCount = 0;
    response.items.forEach(item => {
      if (item.index && item.index.error) {
        console.log(++errorCount, item.index.error);
      }
    });
    console.log(
      `Successfully indexed ${data.length - errorCount}
       out of ${data.length} items`
    );
  })
  .catch(console.err);
};

fs.readFile('single_filtered_user.json', 'utf-8', function(err, data) {
	if(err) {
		console.log(err);
	}
	bulkIndex('users', 'user', JSON.parse(data));
});

