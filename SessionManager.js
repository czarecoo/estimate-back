const simpleid = require("simple-id");

class SessionManager {
	constructor() {
		this.sessions = new Map();
		this.setOfSessionIds = new Set();
	}
	createSession(creator) {
		var id = this.generateSessionId();
		this.sessions.set(id, {
			sessionId: id,
			creator: creator,
			users: new Set(),
			stories: []
		})
	}
	createSessionWithJira(creator, issues, jiraUrl, jiraProject) {
		var id = this.generateSessionId();
		this.sessions.set(id, {
			sessionId: id,
			creator: creator,
			users: [],
			stories: issues,
			jiraUrl: jiraUrl,
			jiraProject: jiraProject
		});
	}
	generateSessionId(){
		while(true){
			var id = simpleid(8, '123456789abcdefghijklmnoprstuwxyz');
			if( !this.setOfSessionIds.has(id) ){ 
				this.setOfSessionIds.add(id); 
				return id; 
			} 
		}
	}
}

// session = {sessionId, users, stories, jiraUrl, jiraProject}
module.exports = SessionManager;
