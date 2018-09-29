const UserManager = require('./UserManager.js');
const JiraManager = require('./JiraManager.js');
const SessionManager = require('./SessionManager.js');

class SessionFunctions {
	static createSession(userName, socketid) {
		console.log("createSession");
		var creator = UserManager.createCreator(userName, socketid);
		SessionManager.createSession(creator);
	}
	static createSessionWithJira(userName, jiraLogin, jiraPassword, jiraUrl, jiraProject, socketid) {
		console.log("createSessionWithJira");
		var issuesPromise = JiraManager.getIssues(jiraLogin, jiraPassword, jiraUrl, jiraProject);
		var creator = UserManager.createCreator(userName, socketid);
		issuesPromise.then(function (issues) {
			try {
				console.log(issues);
				SessionManager.createSessionWithJira(creator, issues, jiraUrl, jiraProject);
				console.log(SessionManager.sessions);
			} catch (ex) {
				console.log("Exception: " + ex.constructor.name + ", message: " + ex.message);
			}
		})
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

	static closeSession(sessionId) {
		for (var user of SessionManager.sessions.get(sessionId).users) {
			//emit do kazdego ziomka
			//trza dac socketa juserowi
		}
		SessionManager.sessions.delete(sessionId);
		SessionManager.setOfSessionIds.delete(sessionId);

		//te dane musimy miec zapisane. Przy tworzeniu sesji z jira trzeba je gdzieś trzymać
		/*
		var jiraLogin = "adam96stan@gmail.com";
		var jiraPassword = "Cedynia97@";
		var jiraUrl = "https://adamjestem.atlassian.net";
		var jiraProject = "ToTylkoDoPobrania";
		var jiraProjectKey = "TOT";
		*/
		JiraManager.updateJiraIssue(jiraUrl, jiraLogin, jiraPassword, "10004", update);
	}
}

module.exports = SessionFunctions;
