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
	static createSessionWithJira(userName, jiraLogin, jiraPassword, jiraUrl, jiraProject, socketId, io) {
		var issuesPromise = JiraManager.getIssues(jiraLogin, jiraPassword, jiraUrl, jiraProject);
		var creator = UserManager.createCreator(userName, socketId);

		issuesPromise.then((issues) => {
			for (var i = issues.length - 1; i >= 0; i--) {
				if (issues[i] == null) {
					issues.splice(i, 1);
				}
			}
			try {
				var session = SessionManager.createSessionWithJira(creator, issues, jiraLogin, jiraPassword, jiraUrl, jiraProject);
			} catch (ex) {
				console.log("Exception: " + ex.constructor.name + ", message: " + ex.message);
			}
			UpdateFunctions.updateFrontUsers(session, io);
		});
	}

	static closeSession(socketId, io) {
		var session = SessionManager.getSessionBySocketId(socketId);

		//update jira issues
		//JiraManager.updateJiraIssue(jiraUrl, jiraLogin, jiraPassword, "10004", update);

		UpdateFunctions.kickFrontUsers(session, io);
		SessionManager.sessions.delete(session.sessionId);
		SessionManager.setOfSessionIds.delete(session.sessionId);
	}

	static joinSession(userName, serverId) {
		var user = UserManager.createUser(userName);
		if (SessionManager.sessions.has(serverId)) {
			user.sessionId = serverId;
			SessionManager.sessions.get(serverId).users.push(user);
			//io.emit("grejt dżojn my frind", greatJoin);
		}
		else {
			//io.emit("you are so stupid... wrong server id, bitch", wrongJoin);
		}
	}
}

module.exports = SessionFunctions;
