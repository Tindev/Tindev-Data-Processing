var reader = require('read-async-bson');
var fs = require('fs');

// How to run this: "cat your-json-file | nodejs dump.js".
 return reader(
   { from: process.stdin },
     function(item, callback) {
         // One BSON document, converted as a JavaScript object 
             fs.appendFileSync('dump/github/json/new_new_repos.json', JSON.stringify(item) + ',\n');
                 return callback(null);
                   },
                     function(err) {
                         // Called on error or at end of stream 
                             if (!err) {
                                   console.log('end of stream');
                                       } else {
                                             console.error(err);
                                                 }
                                                   }
                                                   );
