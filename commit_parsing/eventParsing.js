const github = require("./github.js");

const parseEvents = function(events) {
	let contributions = [];
	for (var i in events) {
		var event = events[i];
		if (event.type == "PushEvent") {
			contributions.push(event);
		}
	}
	return contributions;
}


const parseUserEvents = function(users) {
	var promises = []
	for (var i in users) {
		let user = users[i];
		let url = user + "/events/public" + "?per_page=100";
		var promise = new Promise(async function(resolve, reject) {
			let page = 1;
			let userEvents = null;
			let res = []
			do {
				url = url + "&page=" + page;
				console.log(url);
				let resp = await github.requests(url);
				userEvents = await resp.json();
				console.log(userEvents);
				userParsedEvents = parseEvents(userEvents);
				userParsedEvents.forEach(item => {
					res.push(item);
				});
				page = page + 1;
			}
			while(userEvents.length > 0);
			resolve(res)
		});
		promises.push(promise);
	}
	return Promise.all(promises);
}

console.log(parseUserEvents(["https:\/\/api.github.com/users/GijsWeterings"]));
