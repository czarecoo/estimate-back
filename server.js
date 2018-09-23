const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
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

//testing
var jiraLogin = "adam96stan@gmail.com";
var jiraPassword = "Cedynia97@";
var jiraUrl = "https://adamjestem.atlassian.net";
var jiraProject = "ToTylkoDoPobrania";
createSessionWithJira("userName", jiraLogin, jiraPassword, jiraUrl, jiraProject);
