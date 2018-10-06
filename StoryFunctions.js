const UpdateFunctions = require('./UpdateFunctions.js');
const SessionManager = require('./SessionManager.js');
const StoryManager = require('./StoryManager.js');
const UserManager = require('./UserManager.js');
const Story = require('./Story.js');

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
		} else {
			UpdateFunctions.showErrorToSocketId(socketId, "There is no voting going on right now...", io);
		}
	}

	static startStory(story, socketId, io) {
		var session = SessionManager.getSessionBySocketId(socketId);
		var storyToStart = StoryManager.getStoryFromSession(session, story);
		if (storyToStart != null && StoryManager.getCurrentStory(session) == null) {
			storyToStart.tense = 0;
			UpdateFunctions.updateFrontUsers(session, io);
		} else {
			UpdateFunctions.showErrorToSocketId(socketId, "There can be only one vote at a time.", io);
		}
	}

	static createStory(issueId, summary, socketId, io) {
		if (issueId != "" && summary != "") {
			var session = SessionManager.getSessionBySocketId(socketId);
			if (session != null) {
				session.stories.push(new Story(issueId, summary, false));
				UpdateFunctions.updateFrontUsers(session, io);
			}
		} else {
			UpdateFunctions.showErrorToSocketId(socketId, "Please provide both issueId and summary.", io);
		}
	}

	static markAsFuture(story, socketId, io) {
		var session = SessionManager.getSessionBySocketId(socketId);
		var storyToMark = StoryManager.getStoryFromSession(session, story);
		if (storyToMark != null) {
			storyToMark.tense = -1;
			UpdateFunctions.updateFrontUsers(session, io);
		}
	}

	static finishStory(story, finalScore, socketId, io) {
		var session = SessionManager.getSessionBySocketId(socketId);
		var storyToFinish = StoryManager.getStoryFromSession(session, story);
		if (storyToFinish != null && finalScore != 0) {
			storyToFinish.tense = 1;
			storyToFinish.finalScore = parseInt(finalScore, 10);
			UpdateFunctions.updateFrontUsers(session, io);
		} else {
			UpdateFunctions.showErrorToSocketId(socketId, "Please choose final score.", io);
		}
	}

	static revoteStory(story, socketId, io) {
		var session = SessionManager.getSessionBySocketId(socketId);
		var storyToRevote = StoryManager.getStoryFromSession(session, story);
		if (storyToRevote != null) {
			storyToRevote.tense = -1;
			storyToRevote.users = new Array();
			storyToRevote.votes = new Array();
			storyToRevote.finalScore = 0;
			UpdateFunctions.updateFrontUsers(session, io);
		}
	}
}
module.exports = StoryFunctions;