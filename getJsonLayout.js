'use strict';
var fs = require('fs');
var json;


var filesDir = 'dump/github/json/';
var files = fs.readdirSync(filesDir);
var path = require('path');
//console.log(files);
//for (let file in files) {
   let file = files[0];
   if (path.extname(files[file]) === ".json") {

	fs.readFile(filesDir + files[file], 'utf-8', function(err, data) {
		if(err){
			console.log(err);
		}
		console.log("data")
		json = JSON.parse(data);
		console.log(files[file] + '{');
		console.log(json[0]);
//		if(json[0]){
//			for(var k in json[0]){
//				console.log('\t'+ k);
//			}
//		}
		console.log('}');
	});
  //}
}
