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

function disconnect() {
	console.log("Disconnected");
}

function updateJiraIssue(jiraUrl, jiraLogin, jiraPassword, issueIdOrKey, update) {
	var url = jiraUrl + "/rest/api/3/issue/" + issueIdOrKey + "/editmeta";

	request({
		url: url,
		method: "GET",
		json: true,
		body: update,
		auth: { user: jiraLogin, pass: jiraPassword }
	}, function (error, response, body) {
		console.log('error:', error); // Print the error if one occurred
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		console.log('body:', body); // Print the HTML for the Google homepage.
	}
	);
}



//testing
var jiraLogin = "adam96stan@gmail.com";
var jiraPassword = "Cedynia97@";
var jiraUrl = "https://adamjestem.atlassian.net";
var jiraProject = "ToTylkoDoPobrania";
var jiraProjectKey = "TOT";

var update = {
	"fields": {
		"customfield_10020": 3,
	}
};
updateJiraIssue(jiraUrl, jiraLogin, jiraPassword, "10004", update);
