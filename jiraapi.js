class JiraApi{
    constructor(jiraurl, jiralogin, jirapassword){
        this.protocol = 'https';
		this.host = jiraurl+'.atlassian.net';
		this.username = jiralogin;
		this.password = jirapassword;
		this.apiVersion = '2';
		this.strictSSL = true;
		this.jiraIssues = [];
	}
	addJiraIssues(issue){
		this.jiraIssues.push(issue);
	}

	get getUsername(){
		return this.username;
	}

	get getHost(){
		return this.host;
	}
	get getIssues(){
		return this.jiraIssues;
	}
	
	description(){
		return this.host + ", " + this.username + ", ";
	}
}

module.exports = JiraApi;