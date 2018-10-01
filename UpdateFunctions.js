const SessionManager = require('./SessionManager.js');
const UserManager = require('./UserManager.js');

class UpdateFunctions {
	static updateFrontUsers(session, io) {
		for (var user of session.users) {
			if (user.isCreator) {
				UpdateFunctions.updateFrontCreator(user, session, io);
			} else {
				UpdateFunctions.updateFrontUser(user, session, io);
			}
		}
	}

	static updateFrontCreator(creator, session, io) {
		var data = {
			login: creator.name,
			userId: creator.userId,
			sessionId: session.sessionId,
			isSuperUser: creator.isCreator,
			currentStory: UpdateFunctions.getStoriesWithTense(session.stories, 0),
			userList: session.users,
			futureStories: UpdateFunctions.getStoriesWithTense(session.stories, -1),
			pastStories: UpdateFunctions.getStoriesWithTense(session.stories, 1),
		}
		io.to(creator.socketId).emit("updateResponse", data);
	}

	static updateFrontUser(user, session, io) {
		var data = {
			login: user.name,
			userId: user.userId,
			sessionId: session.sessionId,
			isSuperUser: user.isCreator,
			currentStory: UpdateFunctions.getStoriesWithTense(session.stories, 0),
			userList: session.users,
		}
		io.to(user.socketId).emit("updateResponse", data);
	}

	static kickFrontUsers(session, io) {
		for (var user of session.users) {
			io.to(user.socketId).emit("sessionClosingCommand");
		}
	}

	static kickUser(user, io) {
		io.to(user.socketId).emit("sessionClosingCommand");
	}

	static coffee(socketId, io) {
		var userAskingForCoffee = UserManager.getUserBySocketId(socketId);
		var session = SessionManager.getSessionBySocketId(socketId);
		for (var user of session.users) {
			if (user.socketId != socketId) {
				io.to(user.socketId).emit("coffeeCommand", userAskingForCoffee.name);
			}
		}
	}
	static getStoriesWithTense(stories, wantedTense) {
		var tempArray = [];
		for (var i = 0; i < stories.length; i++) {
			if (stories[i].tense == wantedTense) {
				tempArray.push(stories[i]);
			}
		}
		return tempArray;
	}
}
module.exports = UpdateFunctions;