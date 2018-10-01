class StoryManager {
	static getCurrentStory(session) {
		for (var i = 0; i < session.stories.length; i++) {
			if (session.stories[i].tense == 0) {
				return session.stories[i];
			}
		}
		return null;
	}
	static getStoryFromSession(session, story) {
		for (var i = 0; i < session.stories.length; i++) {
			if (session.stories[i].summary == story.summary && session.stories[i].issueId == story.issueId) {
				return session.stories[i];
			}
		}
		return null;
	}
}
module.exports = StoryManager;