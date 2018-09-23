const search = require('jira-search');
const MAX_CHARS_SHORT_SUMARY = 32;

// var jiralogin = "adam96stan@gmail.com";
// var jirapassword = "Cedynia97@";
// var jiraurl = "https://adamjestem.atlassian.net";
// var jiraproject = "ToTylkoDoPobrania";

class JiraManager {
	static getIssues(jiraLogin, jiraPassword, jiraUrl, jiraProject) {
		return search({
			serverRoot: jiraUrl, user: jiraLogin, pass: jiraPassword, jql: 'project="' + jiraProject + '"', fields: '*all', expand: 'changelog', maxResults: 50, onTotal: function (total) { },
			mapCallback: function (issue) {
				//if(issue=="nie jest zestymowany")
				return { issueId: issue.id, summary: issue.fields.description, shortSummary: issue.fields.description.substring(0, MAX_CHARS_SHORT_SUMARY) + "..." };
			}
		})
	}
}

module.exports = JiraManager;
