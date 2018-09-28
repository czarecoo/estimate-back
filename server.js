const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const port = 8080;
const SessionManagerAdamCosZmienil = require('./SessionManager.js');
const SessionFunctions = require('./SessionFunctions.js');

var SessionManager = new SessionManagerAdamCosZmienil();

server.listen(port, function () {
	console.log('Listening on: ' + port);
	console.log('________________________');
});

io.on('connection', function (socket) {
	console.log("Connected with socketid: ", socket.id);
	socket.on('createSessionRequest', (userName) => SessionFunctions.createSession(userName, socket.id));
	socket.on('createSessionWithJiraRequest', (userName, jiraLogin, jiraPassword, jiraUrl, jiraProject) => SessionFunctions.createSessionWithJira(userName, jiraLogin, jiraPassword, jiraUrl, jiraProject, socket.id));
	socket.on('joinSessionRequest', (userName, serverId) => SessionFunctions.joinSession(userName, serverId));
	socket.on("closeSession", (sessionId) => SessionFunctions.closeSession(sessionId));

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

	socket.on('disconnect', disconnect);
});

//te funkcje musza stąd znikanąć najlepiej do jakiejs klasy jako funkcje statyczne
function vote(story, voteVal, sessionId) {
	for (var user of SessionManager.sessions.get(sessionId).users) {
		//emit do kazdego ziomka, ze inny ziomeczek puscil walju dla story
		//user.socketid.emit
	}
}

function coffee(sessionId) {
	for (var user of SessionManager.sessions.get(sessionId).users) {
		//emit z kofibrejkiem
	}
}

function kickUser(user, sessionId) {
	user.socketid.emit("kickUser");
	for (var user of SessionManager.sessions.get(sessionId).users) {
		updateFrontUser(user);
	}
}

function passCreator(story, sessionId, newCreator) {
	if (SessionManager.sessions.has(sessionId)) {
		for (var user of SessionManager.sessions.get(sessionId).users) {
			if (user.name === newCreator.name) { //sprawdzamy czy jest taki user
				SessionManager.sessions.get(sessionId).creator = user;
			}
		}
	}
}

function finishStory(story, sessionId) {

	updateFrontUsers(SessionManager.sessions.get(sessionId));
}

function markAsFuture(story, sessionId) {

	updateFrontUsers(SessionManager.sessions.get(sessionId));
}

function revoteStory(story, sessionId) {

	updateFrontUsers(SessionManager.sessions.get(sessionId));
}

function addEmptyStory(sessionId) { //jak dajemy empty to bez story

	updateFrontUsers(SessionManager.sessions.get(sessionId));
}

function savesStory(story, sessionId) {

	updateFrontUsers(SessionManager.sessions.get(sessionId));
}

function finalVote(story, sessionId) {

	updateFrontUsers(SessionManager.sessions.get(sessionId));
}

function updateFrontUsers(session) {
	for (var user of session.users) {
		updateFrontUser(user, session);
	}
}

function updateFrontUser(user, session) {
	user.socketid.emit("update", session.users, session.stories);
}

function disconnect() {
	console.log("Disconnected");
}