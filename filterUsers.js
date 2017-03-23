var fs = require("fs")
var json;

fs.readFile('dump/github/users.json', 'utf-8', function(err, data) {
	if (err) {
		console.log(err);
	}

	json = JSON.parse(data);
	var users = {};
	var saveProperties = ['login', 'id', 'company','public_repos','followers'];
	for (var i in json){
		if(json[i]["type"] === 'User'){
			var username = json[i]["login"]; 
			var user = {};
			user = {};
			for(var prop in saveProperties){
				if(saveProperties.hasOwnProperty(prop)){
					user[saveProperties[prop]] = json[i][saveProperties[prop]];
				}
			}
			users[username] = user;
		}
	}
//	console.log(users);
	fs.writeFile('filtered_users.json', JSON.stringify(users), (err) => { 
		if (err) { 
			throw(err);  
		} 
		console.log("Saved");
	});
});
