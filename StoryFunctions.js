const UpdateFunctions = require('./UpdateFunctions.js');
const SessionManager = require('./SessionManager.js');
const StoryManager = require('./StoryManager.js');
const UserManager = require('./UserManager.js');

class StoryFunctions {
	static vote(voteValue, socketId, io) {
		var user = UserManager.getUserBySocketId(socketId);
		var session = SessionManager.getSessionBySocketId(socketId);
		var currentStory = StoryManager.getCurrentStory(session);

		if (currentStory != null) {
			var didThisPersonVotedBefore = false;
			//we try to find the vote and overwrite it with new value
			for (var i = 0; i < currentStory.users.length; i++) {
				if (currentStory.users[i].userId == user.userId) {
					currentStory.votes[i] = voteValue;
					didThisPersonVotedBefore = true;
					break;
				}
			}
			//if user didnt vote before we simply add his vote
			if (!didThisPersonVotedBefore) {
				currentStory.users.push(user);
				currentStory.votes.push(voteValue);
			}

			UpdateFunctions.updateFrontUsers(session, io);
		}
	}

	static startStory(story, socketId, io) {
		var session = SessionManager.getSessionBySocketId(socketId);
		var storyToStart = StoryManager.getStoryFromSession(session, story);
		if (storyToStart != null && StoryManager.getCurrentStory(session) == null) {
			storyToStart.tense = 0;
			UpdateFunctions.updateFrontUsers(session, io);
		}

	}

	static coffee(sessionId, io) {
		for (var user of SessionManager.sessions.get(sessionId).users) {
			io.to(user.socketid).emit("coffeeResponse");
		}
	}
}
module.exports = StoryFunctions;