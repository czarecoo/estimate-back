const search = require('jira-search');
const MAX_CHARS_SHORT_SUMARY = 32;

class JiraManager {
	static getIssues(jiraLogin, jiraPassword, jiraUrl, jiraProject) {
		return search({
			serverRoot: jiraUrl, user: jiraLogin, pass: jiraPassword, jql: 'project="' + jiraProject + '"', fields: '*all', expand: 'changelog', maxResults: 50, onTotal: function (total) { },
			mapCallback: function (issue) {
				if (issue.fields.customfield_10020 == null) {
					var shorterSummary = issue.fields.summary;
					if (shorterSummary.length > MAX_CHARS_SHORT_SUMARY) {
						shorterSummary = issue.fields.summary.substring(0, MAX_CHARS_SHORT_SUMARY) + "..."
					}
					return { issueId: issue.id, summary: issue.fields.summary, shortSummary: shorterSummary };
				} else {
					console.log("Rejecting: ", issue.id, " because it has estimate: ", issue.fields.customfield_10020);
				}
			}
		})
	}
}

module.exports = JiraManager;
