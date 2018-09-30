const simpleid = require("simple-id");

class SessionManager {
	static createSession(creator) {
		var id = SessionManager.generateSessionId();
		creator.sessionId = id;
		SessionManager.sessions.set(id, {
			sessionId: id,
			users: [],
			stories: [],
			isJira: false,
		})
		SessionManager.sessions.get(id).users.push(creator);
		return SessionManager.sessions.get(id);
	}
	static createSessionWithJira(creator, issues, jiraLogin, jiraPassword, jiraUrl, jiraProject) {
		var id = SessionManager.generateSessionId();
		creator.sessionId = id;
		SessionManager.sessions.set(id, {
			sessionId: id,
			users: [],
			stories: issues,
			isJira: true,
			jiraLogin: jiraLogin,
			jiraPassword: jiraPassword,
			jiraUrl: jiraUrl,
			jiraProject: jiraProject
		});
		SessionManager.sessions.get(id).users.push(creator);
		return SessionManager.sessions.get(id);
	}
	static generateSessionId() {
		while (true) {
			var id = simpleid(4, '1234');
			if (!SessionManager.setOfSessionIds.has(id)) {
				SessionManager.setOfSessionIds.add(id);
				return id;
			}
		}
	}
	static getSessionBySocketId(socketId) {
		var mapOfSessions = SessionManager.sessions;
		for (var session of mapOfSessions.values()) {
			for (var user of session.users) {
				if (user.socketId == socketId) {
					return session;
				}
			}
		}
		return null;
	}
}

module.exports = SessionManager;
