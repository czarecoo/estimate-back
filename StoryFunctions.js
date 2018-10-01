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

	static createStory(issueId, summary, socketId, io) {
		if (issueId != "" && summary != "") {
			var session = SessionManager.getSessionBySocketId(socketId);
			session.stories.push(new Story(issueId, summary));
			UpdateFunctions.updateFrontUsers(session, io);
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
		if (storyToFinish != null) {
			storyToFinish.tense = 1;
			storyToFinish.finalScore = finalScore;
			UpdateFunctions.updateFrontUsers(session, io);
		}
	}
}
module.exports = StoryFunctions;