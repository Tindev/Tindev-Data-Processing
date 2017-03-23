var elasticsearch = require('elasticsearch');
var fs = require('fs');
var esClient = require('./elastic-client');

const bulkIndex = function bulkIndex(index, type, data) {
  var bulkBody = [];

  data.forEach(item => {
    bulkBody.push({
      index: {
        _index: index,
        _type: type,
        _id: item.id
      }
    });

    bulkBody.push(item);
  });

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

fs.readFile('filtered_arr_users.json', 'utf-8', function(err, data) {
	if(err) {
		console.log(err);
	}
	bulkIndex('users', 'user', JSON.parse(data));
});

