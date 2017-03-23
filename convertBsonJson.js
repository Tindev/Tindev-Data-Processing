var fs = require('fs');
var BsonJsonTransform = require('bson-json-transform');
var filesDir = 'dump/github/';
var files = fs.readdirSync(filesDir);
var path = require('path');

console.log(process.argv);


function convertFile() {
	for (var file in files) {
		if(process.argv[2]){
			if(files.indexOf(process.argv[2]) !== -1){
				fs
					.createReadStream(filesDir + process.argv[2])
				    .pipe(BsonJsonTransform({arrayOfBsons: true, preserveInt64: 'string' }))
				    .pipe(fs.createWriteStream(filesDir + 'json/' + files[file].slice(0,-4) + 'json'))
				    .on('end', function (data) {
				    	console.log('No more data!');
				    });
			}
		}
		else{
			if (path.extname(files[file]) === ".bson" && files[file].indexOf("metadata") === -1) {
			fs
	    		.createReadStream(filesDir + files[file])
				.pipe(BsonJsonTransform({arrayOfBsons: true, preserveInt64: 'string' }))
				.pipe(fs.createWriteStream(filesDir + 'json/' + files[file].slice(0,-4) + 'json'))
				.on('end', function (data) {
					console.log('No more data!');
				});
	    	}
	    }
	}
}

