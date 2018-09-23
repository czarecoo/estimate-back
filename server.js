const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const request = require('request');
const port = 8080;
const SessionManager = require('./SessionManager.js');
const UserManager = require('./UserManager.js');
const JiraManager = require('./JiraManager.js');

server.listen(port, function () {
	console.log('Listening on: ' + port);
	console.log('________________________');
});

io.on('connection', function (socket) {
	console.log("Connected with socketid: ", socket.id);
	socket.on('createSessionRequest', createSession);
	socket.on('createSessionWithJiraRequest', createSessionWithJira);
	socket.on('joinSessionRequest', joinSession);
	socket.on('disconnect', disconnect);
});

function createSession(userName) {
	console.log("createSession");
	var creator = UserManager.createCreator(userName);
	SessionManager.createSession(creator);
}

function createSessionWithJira(userName, jiraLogin, jiraPassword, jiraUrl, jiraProject) {
	console.log("createSessionWithJira");
	var issuesPromise = JiraManager.getIssues(jiraLogin, jiraPassword, jiraUrl, jiraProject);
	var creator = UserManager.createCreator(userName);
	issuesPromise.then(function (issues) {
		console.log(issues);
		SessionManager.createSessionWithJira(creator, issues);
	})
}

function joinSession(userName, serverId) {

}

function updateJiraIssue(jiraUrl, jiraLogin, jiraPassword, issueIdOrKey, message){
	var url = jiraUrl + "/rest/api/2/issue/" + issueIdOrKey + "/transitions";
	
	request({
		url: url,
		method: "POST",
		json: true,
		body: message,
		auth: {user: jiraLogin, pass: jiraPassword}
	}, function (error, response, body) {
		if (!error && response.statusCode === 204) {
			console.log("OK");
		} else if (error) {
			console.log(error);
		} else {
			console.log(response.statusCode);
		}
	});
}

function createJiraIssue(jiraUrl, jiraLogin, jiraPassword, issue){
	var url = jiraUrl + "/rest/api/2/issue/";

	request({
		url: url,
		method: "POST",
		json: true,
		body: issue,
		auth: {user: jiraLogin, pass: jiraPassword}
	}, function(error, response, body){
		if(!error && response.statusCode === 204){
			console.log("OK");
		} else if (error) {
			console.log(error);
		} else {
			console.log(response.statusCode);
		}
	});
}

function disconnect() {
	console.log("Disconnected");
}

//testing
var jiraLogin = "adam96stan@gmail.com";
var jiraPassword = "Cedynia97@";
var jiraUrl = "https://adamjestem.atlassian.net";
var jiraProject = "ToTylkoDoPobrania";
var jiraProjectKey = "TOT"
//createSessionWithJira("userName", jiraLogin, jiraPassword, jiraUrl, jiraProject);
var message = {
	"update": {
		"comment": [{"add": {"body": "Test comment."}}]
	},
	"transition": {"id": "21"}
};
var issue = {
    "fields": {
		"project": {
			"key": jiraProjectKey
		},
		"summary": "your summary",
		"description": "your description",
		"issuetype": {
			"name": "your issuetype"
		},
		"priority": {
			"name": "Minor"
		}
	}
}
//updateJiraIssue(jiraUrl, jiraLogin, jiraPassword, "TOT-1", message)
createJiraIssue(jiraUrl, jiraLogin, jiraPassword, issue);
