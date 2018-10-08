const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

const port = 8080;
const SessionFunctions = require("./SessionFunctions.js");
const StoryFunctions = require("./StoryFunctions.js");
const UpdateFunctions = require("./UpdateFunctions.js");
const IntervalFunctions = require("./IntervalFunctions.js");
const UserFunctions = require("./UserFunctions.js");

var SessionManager = require('./SessionManager.js');

SessionManager.sessions = new Map();
SessionManager.setOfSessionIds = new Set();
SessionManager.setOfUserIds = new Set();

server.listen(port, function () {
	console.log("Listening on: " + port);
	console.log("________________________");
});

io.on("connection", function (socket) {
	console.log("Connected with socketid: ", socket.id);

	socket.on("createSessionRequest", (creatorName) => {
		console.log("createSessionRequest", creatorName);
		SessionFunctions.createSession(creatorName, socket.id, io);
	});
	socket.on("createSessionWithJiraRequest", (creatorName, jiraLogin, jiraPassword, jiraUrl, jiraProject, jiraProjectKey) => {
		console.log("createSessionWithJiraRequest", creatorName, jiraLogin, jiraPassword, jiraUrl, jiraProject, jiraProjectKey);
		SessionFunctions.createSessionWithJira(creatorName, jiraLogin, jiraPassword, jiraUrl, jiraProject, jiraProjectKey, socket.id, io);
	});
	socket.on("activityResponse", () => {
		IntervalFunctions.raiseActivity(socket.id);
	});
	socket.on("closeSessionRequest", () => {
		console.log("closeSessionRequest");
		SessionFunctions.closeSession(socket.id, io);
	});
	socket.on("leaveSessionRequest", () => {
		console.log("leaveSessionRequest");
		SessionFunctions.leaveSession(socket.id, io);
	});
	socket.on("joinSessionRequest", (userName, serverId) => {
		console.log("joinSessionRequest", userName, serverId);
		SessionFunctions.joinSession(userName, serverId, socket.id, io);
	});
	socket.on("rejoinSessionRequest", (userName, userId, sessionId) => {
		console.log("rejoinSessionRequest", userName, userId, sessionId);
		SessionFunctions.rejoinSession(userName, userId, sessionId, socket.id, io);
	});
	socket.on("kickRequest", (userToKick) => {
		console.log("kickRequest", userToKick);
		UserFunctions.kickUser(userToKick, socket.id, io);
	});
	socket.on("passCreatorRequest", (userToPromote) => {
		console.log("passCreatorRequest", userToPromote);
		UserFunctions.promoteUser(userToPromote, socket.id, io);
	});
	socket.on("voteRequest", (voteValue) => {
		console.log("voteRequest", voteValue);
		StoryFunctions.vote(voteValue, socket.id, io);
	});
	socket.on("startStoryRequest", (story) => {
		console.log("startStoryRequest", story);
		StoryFunctions.startStory(story, socket.id, io);
	});
	socket.on("coffeeRequest", () => {
		console.log("coffeeRequest");
		UpdateFunctions.coffee(socket.id, io);
	});
	socket.on("createStoryRequest", (summary, description) => {
		console.log("createStoryRequest", summary, description);
		StoryFunctions.createStory(summary, description, socket.id, io);
	});
	socket.on("markAsFutureRequest", (story) => {
		console.log("markAsFutureRequest", story)
		StoryFunctions.markAsFuture(story, socket.id, io);
	});
	socket.on("finishStoryRequest", (story, finalScore) => {
		console.log("finishStoryRequest", story, finalScore);
		StoryFunctions.finishStory(story, finalScore, socket.id, io);
	});
	socket.on("revoteRequest", (story) => {
		console.log("revoteRequest", story);
		StoryFunctions.revoteStory(story, socket.id, io);
	});
	socket.on("disconnect", () => {
		console.log("disconnect", socket.id)
		UserFunctions.setInactive(socket.id, io);
	});
});

IntervalFunctions.doPingRequest(io, 1000); //ask for activity confirmation every 1s
IntervalFunctions.doLogger(5000); //print map of sessions every 5s
IntervalFunctions.clearStaleSessions(10000); //check for stale sessions every 10s