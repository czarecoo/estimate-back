const simpleid = require("simple-id");

class SessionManager {	
	static createSession(creator) {
		var id = SessionManager.generateSessionId();
		creator.sessionId = id;
		SessionManager.sessions.set(id, {
			sessionId: id,
			creator: creator,
			users: [],
			stories: []
		})
		SessionManager.sessions.get(id).users.push(creator);
	}
	static createSessionWithJira(creator, issues, jiraUrl, jiraProject) {
		var id = SessionManager.generateSessionId();
		creator.sessionId = id;
		SessionManager.sessions.set(id, {
			sessionId: id,
			creator: creator,
			users: [],
			stories: issues,
			jiraUrl: jiraUrl,
			jiraProject: jiraProject
		});
		SessionManager.sessions.get(id).users.push(creator);
	}
	static generateSessionId(){
		while(true){
			var id = simpleid(8, '123456789abcdefghijklmnoprstuwxyz');
			if( !SessionManager.setOfSessionIds.has(id) ){ 
				SessionManager.setOfSessionIds.add(id); 
				return id; 
			} 
		}
	}
}

// session = {sessionId, users, stories, jiraUrl, jiraProject}
module.exports = SessionManager;
