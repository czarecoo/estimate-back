class Session {
    constructor(creatorLogin, sessionId, jiraApi){
        if(jiraApi.constructor.name == "JiraApi" ){
            this.jiraApi = jiraApi;
        }
        this.creatorLogin = creatorLogin;
        this.sessionId = sessionId;
    }
}