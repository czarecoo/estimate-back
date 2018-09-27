const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const request = require('request');
const port = 8080;
const SessionManagerAdamCosZmienil = require('./SessionManager.js');
const UserManager = require('./UserManager.js');
const JiraManager = require('./JiraManager.js');

var SessionManager = new SessionManagerAdamCosZmienil();

server.listen(port, function () {
	console.log('Listening on: ' + port);
	console.log('________________________');
});

io.on('connection', function (socket) {
	console.log("Connected with socketid: ", socket.id);
	socket.on('createSessionRequest', createSession(userName, socket.id));
	socket.on('createSessionWithJiraRequest', createSessionWithJira(userName, jiraLogin, jiraPassword, jiraUrl, jiraProject, socket.id));
	socket.on('joinSessionRequest', joinSession(userName, serverId));
	socket.on('disconnect', disconnect);

	socket.on("closeSession", closeSession(sessionId));
	socket.on("vote", vote(story, voteVal));
	socket.on("coffee", coffee());
	socket.on("kickUser", kickUser(user)); // user={userName, userId, userSocket}
	socket.on("passCreator", passCreator(user));
	socket.on("startStory", startStory(story));
	socket.on("finishStory", finishStory(story));
	socket.on("markAsFuture", markAsFuture(story));												
	socket.on("revote", revoteStory(story));

	socket.on("addEmptyStory", addEmptyStory(story));
	socket.on("saveStory", savesStory(story));
	socket.on("finalVote", finalVote(story));
});

function createSession(userName, socketid) {
	console.log("createSession");
	var creator = UserManager.createCreator(userName, socketid);
	SessionManager.createSession(creator);
}

function createSessionWithJira(userName, jiraLogin, jiraPassword, jiraUrl, jiraProject, socketid) {
	console.log("createSessionWithJira");
	var issuesPromise = JiraManager.getIssues(jiraLogin, jiraPassword, jiraUrl, jiraProject);
	var creator = UserManager.createCreator(userName, socketid);
	issuesPromise.then(function (issues) {
		try{
			console.log(issues);
			SessionManager.createSessionWithJira(creator, issues, jiraUrl, jiraProject);
			console.log(SessionManager.sessions);
		} catch(ex){
			console.log("Exception: " + ex.constructor.name + ", message: " + ex.message);
		}
	})
}

function joinSession(userName, serverId) {
	var user = UserManager.createUser(userName);
	if(SessionManager.sessions.has(serverId)){
		user.sessionId = serverId;
		SessionManager.sessions.get(serverId).users.push(user);
		//io.emit("grejt dżojn my frind", greatJoin);
	}
	else {
		//io.emit("you are so stupid... wrong server id, bitch", wrongJoin);
	}
}

function closeSession(sessionId){
	for(var user of SessionManager.sessions.get(sessionId).users){
		//emit do kazdego ziomka
		//trza dac socketa juserowi
	}
	SessionManager.sessions.delete(sessionId);
	SessionManager.setOfSessionIds.delete(sessionId);
}

function vote(story, voteVal, sessionId){
	for(var user of SessionManager.sessions.get(sessionId).users){
		//emit do kazdego ziomka, ze inny ziomeczek puscil walju dla story
		//user.socketid.emit
	}
}

function coffee(sessionId){
	for(var user of SessionManager.sessions.get(sessionId).users){
		//emit z kofibrejkiem
	}
}

function kickUser(user, sessionId){
	user.socketid.emit("kickUser");
	for(var user of SessionManager.sessions.get(sessionId).users){
		updateFrontUser(user);
	}
}

function passCreator(story, sessionId, newCreator){
	if(SessionManager.sessions.has(sessionId)){
		for(var user of SessionManager.sessions.get(sessionId).users){
			if(user.name === newCreator.name){ //sprawdzamy czy jest taki user
				SessionManager.sessions.get(sessionId).creator = user;
			}
		}
	}
}

function finishStory(story, sessionId){

	updateFrontUsers(SessionManager.sessions.get(sessionId));
}

function markAsFuture(story, sessionId){

	updateFrontUsers(SessionManager.sessions.get(sessionId));
}

function revoteStory(story, sessionId){
	
	updateFrontUsers(SessionManager.sessions.get(sessionId));
}

function addEmptyStory(sessionId){ //jak dajemy empty to bez story

	updateFrontUsers(SessionManager.sessions.get(sessionId));
}

function savesStory(story, sessionId){

	updateFrontUsers(SessionManager.sessions.get(sessionId));
}

function finalVote(story, sessionId){

	updateFrontUsers(SessionManager.sessions.get(sessionId));
}

function updateFrontUsers(session){
	for(var user of session.users){
		updateFrontUser(user, session);
	}
}

function updateFrontUser(user, session){
	user.socketid.emit("update", session.users, session.stories );
}

function disconnect() {
	console.log("Disconnected");
}

function updateJiraIssue(jiraUrl, jiraLogin, jiraPassword, issueIdOrKey, update) {
	var url = jiraUrl + "/rest/api/3/issue/" + issueIdOrKey;

	request({
		url: url,
		method: "PUT",
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
createSessionWithJira("userName", jiraLogin, jiraPassword, jiraUrl, jiraProject);