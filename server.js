var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var JiraApi = require('./jiraapi.js');
var port = 8080;
var SessionManager = require('./sessionmanager.js');
var search = require('jira-search');
var jiralogin = "adam96stan@gmail.com";
var jirapassword = "Cedynia97@";
var jiraurl = "adamjestem";
var jiraproject = "ToTylkoDoPobrania";
var mainSessionManager = new SessionManager();
function ConnectWithJira(login,jiraurl,jiralogin,jirapassword,jiraproject){
	//jira stuff
	
	var jira = {
		protocol: 'https',
		host: jiraurl,
		username: jiralogin,
		password: jirapassword,
		apiVersion: '2',
		strictSSL: true
	};
	
	search({
		serverRoot: 'https://'+jiraurl+'.atlassian.net', // the base URL for the JIRA server
		user: jiralogin, // the user name
		pass: jirapassword, // the password
		jql: 'project="'+jiraproject+'"', // the JQL
		fields: '*all', // the fields parameter for the JIRA search
		expand: 'changelog', // the expand parameter for the JIRA search
		maxResults: 50, // the maximum number of results for each request to JIRA, multiple requests will be made till all the matching issues have been collected
		onTotal: function (total) {
		  // optionally initialise a progress bar or something
		},
		mapCallback: function (issue) {
		  // This will be called for each issue matching the search.
		  // Update a progress bar or something if you want here.
		  // The return value from this function will be added
		  // to the array returned by the promise.
		  // If omitted the default behaviour is to add the whole issue
		  return issue;
		}
	  }).then(function (issues) {
		  /*var new_session = new SessionReq(login,socket.socketId,issues);
			var old_size = mapOfSessions.size;
			do{
				if (mapOfSessions.has(new_session.getSessionId)) {
					new_session.getSessionId = SessionReq.generateId();
				} else {
					mapOfSessions.set(new_session.getSessionId, new_session);
				}
				var new_size = mapOfSessions.size;
			} while(old_size == new_size);
			console.log("Session id: " + new_session.getSessionId);
			io.emit('session_response', new_session.getSessionId, socket.socketId);*/

			for(var issue of issues){
				//console.log(issue);
				//console.log(issue.fields);
				console.log(issue.key);
				console.log(issue.fields.summary);

			}
			console.log("wszystkie issue: " + issues);

	  });
}
/*
io.on('connection', function(socket){
	console.log("Connected");
	socket.on('change', function () {
		console.log("Change");
	});
	socket.on('disconnect', function () {
		console.log("Disconnected");
	});
});

server.listen(port, function() {
	console.log('Listening on: '+ port);
	console.log('________________________');
});
*/
// TEST:
//ConnectWithJira("",jiraurl,jiralogin,jirapassword,jiraproject);
mainSessionManager.connectWithJira("",jiraurl,jiralogin,jirapassword,jiraproject, mainSessionManager);