class Session {
    constructor(creatorLogin, sessionId, jiraApi){
        if(jiraApi.constructor.name == "JiraApi" ){
            this.jiraApi = jiraApi;
        }
        this.creatorLogin = creatorLogin;
        this.sessionId = sessionId;
    }
    get getJiraApi(){
        return this.jiraApi;
    }
    get getCreatorLogin(){
        return this.creatorLogin;
    }
    get getSessionId(){
        return this.sessionId;
    }
    description(){
        return this.sessionId + ", creator: " 
            + this.creatorLogin + "\n" 
            + "\t Jira: " + this.jiraApi.description();
    }
}

module.exports = Session;