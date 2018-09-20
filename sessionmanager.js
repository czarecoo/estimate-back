const Session = require('./session.js');
const JiraApi = require('./jiraapi.js');
const JiraFront = require('./issuefront.js');
var search = require('jira-search');

class SessionManager{
    constructor(){
        this.sessions = new Map();
        this.sessionsIds = new Set();
    }
    
    get getSessions(){
        return this.sessions;
    }
    
    static get GENERATE_SESSION_ID(){
        //there will be something
        return 1;
    }
    

    connectWithJira(login,jiraurl,jiralogin,jirapassword,jiraproject, sessionManager){
        
        search({
            serverRoot: 'https://'+jiraurl+'.atlassian.net', // the base URL for the JIRA server
            user: jiralogin, // the user name
            pass: jirapassword, // the password
            jql: 'project="'+jiraproject+'"', // the JQL
            fields: '*all', // the fields parameter for the JIRA search
            expand: 'changelog', // the expand parameter for the JIRA search
            maxResults: 50, // the maximum number of results for each request to JIRA, multiple requests will be made till all the matching issues have been collected
            onTotal: function (total) {

            },
            mapCallback: function (issue) {
              return issue;
            }
          }).then(function (issues) {
                var sessionId = SessionManager.GENERATE_SESSION_ID;
                var jira = new JiraApi(jiraurl, jiralogin, jirapassword);
                var issuesFront = []; 
                var i = 0;
                console.log("Id of new session: " + sessionId);
                for(var issue of issues){
                    i++;
                    console.log('Robi sie raz: ' + i);
                    //console.log(issues);
                    console.log("Issue's key: " + issue.key);
                    console.log("Issue's summary: " + issue.fields.summary);
                    issuesFront.push(new JiraFront(issue.key, issue.fields.summary));
                    jira.addJiraIssues(issue);
                }
                console.log("wszystkie issue: " + issues);
                console.log("Parametry: " + login + ";" + sessionId + ";" + jira);
                sessionManager.sessionsIds.set(sessionId); //tu chciałem aby było this, 
                //nie umiem zrobic that, myslalem, ze jak przekaze parametrem to bedzie git a nie jest
                //var that = this; trzeba zrobic, ale nie wiem gdzie
                console.log("JiraApi: " + jira.username + " " + jira.constructor.name);
                sessionManager.sessions.set(sessionId, new Session(login, sessionId, jira));
                //this.sessionsIds.set(sessionId);
                //emit issueFront
                //emit correct session or something
                console.log("nowa sesja: "+ this.sessions.get(sessionId));
          });
    }
    get getSessionsIds(){
        return this.sessionsIds;
    }
}

module.exports = SessionManager;