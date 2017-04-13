var github = require('./githubChak.js');
var path = "https://api.github.com";
var fs = require('fs');

async function processFile(inputFile) {
	var fs = require('fs'),
			readline = require('readline'),
            instream = fs.createReadStream(inputFile),
            outstream = new (require('stream'))(),
            rl = readline.createInterface(instream, outstream);
    var counter = 0;
    var limit = 10;
	var reposProperties = ['id', 'name', 'full_name', 'commits_url',  'contributors_url', 'stargazers_count', 'languages_url', 'html_url', 'url', 'subscribers_count'];
	var repos = [];
    rl.on('line', function (line) {
    	// Do something for every line.
   		json = JSON.parse(line);
   		// First 10 repos that have a language and have more than 0 stars
  		if (counter < limit && json.language && json.stargazers_count > 0) {
  			var repo = {};
	   		for (var prop in json) {
	   			if (reposProperties.indexOf(prop) !== -1) {
	   				if (prop === 'contributors_url') {
	   					repo[prop] = json[prop];
	   				} else {
						repo[prop] = json[prop];
					}
   				}
   			}
   			counter++;
   			repos.push(repo);
   		}
	});

	return new Promise((resolve, reject) => {
		rl.on('close', async (line) => {
    		// Do something for the last line.
        	console.log('done reading file.');
			console.log('amount of repos: ' + counter);
			resolve(repos);
		});
    });
}

function fetchFrom (repos, prop, process) {
	return new Promise((resolve, reject) => {
		Promise.all(repos.map(item => {
			return github.request(item[prop], {}, process)
		})).then(values => resolve(values))
			.catch(reason => reject(reason));
	});
}

function processUser (body) {
	var userProperties = ['name', 'company', 'location', 'email', 'hireable', 'bio', 'public_repos', 'followers', 'created_at'];
	var user = JSON.parse(body);
	var fil_user = {};
	if (user['type'] === 'User') {
		for (var prop in user) {
			if (userProperties.indexOf(prop) !== -1) {
				fil_user[prop] = user[prop];
			}
		}
	}
	return fil_user;
}

function processContributors (body) {
	var userProperties = ['login', 'id', 'url', 'html_url', 'repos_url', 'contributions'];
	return new Promise((resolve, reject) => {
		Promise.all(JSON.parse(body).map(async (user) => {
			if (user['type'] === 'User') {
				var fil_user = {};
				for (var prop in user) {
					if (userProperties.indexOf(prop) !== -1) {
						fil_user[prop] = user[prop];
					}
				}
				var extra_info = await github.request(user['url'], {}, processUser);
				for (var info in extra_info) {
					fil_user[info] = extra_info[info];
				}
				return fil_user;
			}
		})).then(values => resolve(values))
			.catch(reason => reject(reason));
	});
}

function processLanguages (body) {
	var json = JSON.parse(body);
	return json;
}

function linkLanguages(users, languages) {
	var len = users.length;
	if (len === languages.length) {
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < users[i].length; j++) {
				var language = {};
				for (var lan in languages[i]) {
					language[lan] = users[i][j].contributions;
				}
				users[i][j]['language'] = language;
			}
		}
	} else {
		console.log('Array lengths do not match.');
	}
}

async function repos() {
	return await processFile('dump/github/json/ten_repos.json');
}

async function contributors() {
	var reps = await repos();
	var contributors = await fetchFrom(reps, 'contributors_url', processContributors);
	checkDuplicate(contributors);
	var languages = await fetchFrom(reps, 'languages_url', processLanguages);
	linkLanguages(contributors, languages);
//	fs.writeFile('dump/github/json/final_contributors_limit_reposizes.json', JSON.stringify(contributors), (err) => {
//  		if (err) throw err;
//  	    	console.log('The file has been saved!');
//    });
	return contributors;
}

function fixDuplicate(contributors) {
	for (var i = 0; i < contributors.length; i ++) {
		for (var z = 0; z < contributors[i].length; z++) {
			for (var j = i + 1; j < contributors.length; j++) {
				var max = contributors[j].length;
				while(max--) {
					if (contributors[i][z].login === contributors[j][max].login) {
//						console.log('Match at i=' + i + ' z=' + z + '(' + contributors[i][z].login + ') and '+ ' j=' + j + ' k=' + max + ' ' + '(' + contributors[j][max].login + ') ');
						var first = contributors[i][z].language;
						var second = contributors[j][max].language;
						contributors[i][z].language = combineLanguages(first, second);
						contributors[i][z].contributions = contributors[i][z].contributions + contributors[j][max].contributions;
						contributors[j].splice(max, 1);
					}
				}
			}
		}
	}
}

function combineLanguages(first, second) {
	for (var lan in second) {
		if (first.hasOwnProperty(lan)) {
			first[lan] = first[lan] + second[lan];
		} else {
			first[lan] = second[lan];
		}
	}
	return first;
}

function countusers(contributors) {
	var amount = 0;
	contributors.map(item => {
		amount += item.length;
	});
	return amount;
}

function processContributors(fileName) {
	var contents = JSON.parse(fs.readFileSync(fileName, 'utf8'));
	fixDuplicate(contents);
	return contents;
}

module.exports = {
	repos: function() {
		return repos();
	},
	users: function() {
		return contributors();
	},
	processedContributors: function() {
		return processContributors('dump/github/json/final_contributors_limit.json');
	}
}
