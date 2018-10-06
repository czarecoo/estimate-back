const UserManager = require('./UserManager.js');
const JiraManager = require('./JiraManager.js');
const SessionManager = require('./SessionManager.js');
const UpdateFunctions = require('./UpdateFunctions.js');

class SessionFunctions {
	static createSession(userName, socketId, io) {
		var creator = UserManager.createCreator(userName, socketId);
		var session = SessionManager.createSession(creator);
		UpdateFunctions.updateFrontUsers(session, io);
	}
	static createSessionWithJira(userName, jiraLogin, jiraPassword, jiraUrl, jiraProject, jiraProjectKey, socketId, io) {
		var issuesPromise = JiraManager.getIssues(jiraLogin, jiraPassword, jiraUrl, jiraProjectKey, jiraProject);
		var creator = UserManager.createCreator(userName, socketId);

		issuesPromise.then((issues) => {
			for (var i = issues.length - 1; i >= 0; i--) {
				if (issues[i] == null) {
					issues.splice(i, 1);
				}
			}
			var session = SessionManager.createSessionWithJira(creator, issues, jiraLogin, jiraPassword, jiraUrl, jiraProject, jiraProjectKey);
			UpdateFunctions.updateFrontUsers(session, io);
			return;
		});
		UpdateFunctions.showErrorToSocketId(socketId, "Could not connect to jira with provided data.", io);
	}

	static joinSession(userName, serverId, socketId, io) {
		if (SessionManager.sessions.has(serverId)) {
			var user = UserManager.createUser(userName, socketId);
			user.sessionId = serverId;
			user.isActive = true;
			user.activityLevel = 5;
			SessionManager.sessions.get(serverId).users.push(user);
			UpdateFunctions.updateFrontUsers(SessionManager.sessions.get(serverId), io);
		} else {
			UpdateFunctions.showErrorToSocketId(socketId, "Session: " + serverId + " does not exist", io);
		}
	}

	static rejoinSession(userName, userId, sessionId, socketId, io) {
		if (SessionManager.sessions.has(sessionId)) {
			var session = SessionManager.sessions.get(sessionId);
			var user = UserManager.findUser(session, userName, userId);
			if (user != null && !user.isActive) {
				UpdateFunctions.kickUser(user, io);
				user.socketId = socketId;
				user.isActive = true;
				user.activityLevel = 5;
				UpdateFunctions.updateFrontUsers(SessionManager.sessions.get(sessionId), io);
			}
		}
	}

	static closeSession(socketId, io) {
		var session = SessionManager.getSessionBySocketId(socketId);
		if (session.isJira) {
			var stories = session.stories;
			for (var i in session.stories) {
				if (stories[i].tense == 1 && stories[i].finalScore != 0) {
					if (stories[i].doesExist) {
						JiraManager.updateJiraIssue(session.jiraUrl, session.jiraLogin, session.jiraPassword, stories[i].issueId, stories[i].finalScore);
					} else {
						JiraManager.createJiraIssue(session.jiraUrl, session.jiraLogin, session.jiraPassword, session.jiraProjectKey, stories[i].summary, stories[i].summary, stories[i].finalScore);
					}
				}
			}
		}
		UpdateFunctions.kickFrontUsers(session, io);
		SessionManager.sessions.delete(session.sessionId);
		SessionManager.setOfSessionIds.delete(session.sessionId);
	}

	static leaveSession(socketId, io) {
		var session = SessionManager.getSessionBySocketId(socketId);
		var user = UserManager.getUserBySocketId(socketId);
		SessionManager.removeUser(session, user);
		UpdateFunctions.kickUser(user, io);
		UpdateFunctions.updateFrontUsers(session, io);
	}
}

module.exports = SessionFunctions;
