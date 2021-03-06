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
			currentVote: UpdateFunctions.getVoteValue(session.stories, creator),
			userList: session.users,
			futureStories: UpdateFunctions.getStoriesWithTense(session.stories, -1),
			pastStories: UpdateFunctions.getStoriesWithTense(session.stories, 1),
			isJira: session.isJira
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
			currentVote: UpdateFunctions.getVoteValue(session.stories, user),
			userList: session.users,
			isJira: session.isJira
		}
		io.to(user.socketId).emit("updateResponse", data);
	}

	static kickFrontUsers(session, io) {
		for (var user of session.users) {
			UpdateFunctions.kickUser(user, io);
		}
	}

	static kickUser(user, io) {
		io.to(user.socketId).emit("sessionClosingCommand");
	}

	static showErrorToUser(user, msg, io) {
		io.to(user.socketId).emit("errorCommand", msg);
	}

	static showErrorToSocketId(socketId, msg, io) {
		io.to(socketId).emit("errorCommand", msg);
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
	static getVoteValue(stories, userToSearch) {
		for (var i = 0; i < stories.length; i++) {
			if (stories[i].tense == 0) {
				for (var j = 0; j < stories[i].users.length; j++) {
					if (stories[i].users[j].socketId == userToSearch.socketId) {
						return stories[i].votes[j];
					}
				}
			}
		}
		return null;
	}
}
module.exports = UpdateFunctions;