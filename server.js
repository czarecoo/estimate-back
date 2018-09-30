const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

const port = 8080;
const SessionFunctions = require("./SessionFunctions.js");
const StoryFunctions = require("./StoryFunctions.js");
const UpdateFunctions = require("./UpdateFunctions.js");
const IntervalFunctions = require("./IntervalFunctions.js");
var SessionManager = require('./SessionManager.js');
SessionManager.sessions = new Map();
SessionManager.setOfSessionIds = new Set();

server.listen(port, function () {
	console.log("Listening on: " + port);
	console.log("________________________");
});

io.on("connection", function (socket) {
	console.log("Connected with socketid: ", socket.id);

	socket.on("createSessionRequest", (creatorName) => {
		console.log("createSessionRequest", creatorName);
		SessionFunctions.createSession(creatorName, socket.id);
	});
	socket.on("createSessionWithJiraRequest", (creatorName, jiraLogin, jiraPassword, jiraUrl, jiraProject) => console.log("createSessionWithJiraRequest", creatorName, jiraLogin, jiraPassword, jiraUrl, jiraProject));
	socket.on("joinSessionRequest", (creatorName, serverId) => console.log("joinSessionRequest", creatorName, serverId));
	socket.on("closeSessionRequest", () => console.log("closeSessionRequest"));
	socket.on("voteRequest", (voteValue) => console.log("voteRequest", voteValue));
	socket.on("coffeeRequest", () => console.log("coffeeRequest"));
	socket.on("kickRequest", (userToKick) => console.log("kickRequest", userToKick));
	socket.on("passCreatorRequest", (userToPromote) => console.log("passCreatorRequest", userToPromote));
	socket.on("startStoryRequest", (story) => console.log("startStoryRequest", story));
	socket.on("createStoryRequest", (summary, issueId) => console.log("createStoryRequest", summary, issueId));
	socket.on("finishStoryRequest", (story, finalScore) => console.log("finishStoryRequest", story, finalScore));
	socket.on("markAsFutureRequest", (story) => console.log("markAsFutureRequest", story));
	socket.on("revoteRequest", (story) => console.log("revoteRequest", story));
	/*
	socket.on("createSessionRequest", (userName) => SessionFunctions.createSession(userName, socket.id));
	socket.on("createSessionWithJiraRequest", (userName, jiraLogin, jiraPassword, jiraUrl, jiraProject) => SessionFunctions.createSessionWithJira(userName, jiraLogin, jiraPassword, jiraUrl, jiraProject, socket.id));
	socket.on("joinSessionRequest", (userName, serverId) => SessionFunctions.joinSession(userName, serverId));
	socket.on("closeSession", (sessionId) => SessionFunctions.closeSession(sessionId));
	
	socket.on("vote", vote(story, voteVal));
	socket.on("coffee", coffee());
	socket.on("kickUser", kickUser(user)); // user={userName, userId, userSocket}
	socket.on("passCreator", passCreator(user));
	socket.on("startStory", startStory(story));
	socket.on("finishStory", finishStory(story));
	socket.on("markAsFuture", markAsFuture(story));
	socket.on("revote", revoteStory(story));
	*/
	socket.on("disconnect", () => console.log("disconnect", socket.id));

	/*
	var counter = 0;
	setInterval(function () {
		counter++;
		socket.emit("updateResponse", { ble: counter });
	}, 5000);
	*/
});

function disconnect() {
	console.log("Disconnected");
}

//pinger
IntervalFunctions.doPingRequest(io);
IntervalFunctions.doLogger();