//imports:
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var search = require('jira-search');
//our classes:
var Session = require('./session.js');
var JiraApi = require('./jiraapi.js');
var IssueFront = require('./issuefront.js')
//data:
var port = 8080;
var jiralogin = "adam96stan@gmail.com";
var jirapassword = "Cedynia97@";
var jiraurl = "adamjestem";
var jiraproject = "ToTylkoDoPobrania";

var sessionManager = {
	sessionsIds: new Set(),
	sessions: new Map(),
	getSessionsIds: function(){
		return this.sessionsIds;
	}
};

function generateSessionID(){
	return 1;
}

function ConnectWithJira(login,jiraurl,jiralogin,jirapassword,jiraproject){
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
			try{
				var sessionId = generateSessionID();
				var jira = new JiraApi(jiraurl, jiralogin, jirapassword);
				var issuesFront = []; 
				var i = 0;
				console.log("Id of new session: " + sessionId);
				for(var issue of issues){
					i++;
					console.log('Robi sie raz: ' + i);
					//console.log(issues);
					console.log("Issue's key: " + issue.key);
					console.log("Issue's summary: " + issue.fields.summary);
					issuesFront.push(new IssueFront(issue.key, issue.fields.summary));
					jira.addJiraIssues(issue);
				}
				sessionManager.sessionsIds.add(sessionId);
				console.log("JiraApi: " + jira.description());
				sessionManager.sessions.set(sessionId, new Session(login, sessionId, jira));
				//emit issueFront
				console.log("We check that everything is ok with issues for frontend");
				for(var issueFront of issuesFront){
					console.log(issueFront.description());
				}
				console.log("We check that everything is ok with sessions");
				for(var ses of sessionManager.sessions.values()){
					console.log(ses.description());
					console.log("Issues from session: ");
					console.log(ses.getJiraApi.getIssues)
				}
				//emit correct session or something
			} catch(e){
				console.log('Exception was found while creating new jira session...');
				console.log('Exception\'s type: ' + e.constructor.name);
				console.log('Exception message: ' + e.message);
			}
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
ConnectWithJira("loginJakisWymyslony",jiraurl,jiralogin,jirapassword,jiraproject);