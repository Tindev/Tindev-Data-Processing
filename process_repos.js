function processFile(inputFile) {
	var fs = require('fs'),
			readline = require('readline'),
            instream = fs.createReadStream(inputFile),
            outstream = new (require('stream'))(),
            rl = readline.createInterface(instream, outstream);
    var counter = 0;
    rl.on('line', function (line) {
    	// Do something for every line.
    	counter++;//console.log(line);
	});
    rl.on('close', function (line) {
    	// Do something for the last line.
    	counter++;//console.log(line);
        console.log('done reading file.');
		console.log(counter);
    });
}

processFile('dump/github/json/repos_no_comma.json');
