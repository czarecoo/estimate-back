const search = require('jira-search');
const MAX_CHARS_SHORT_SUMARY = 32;
const request = require('request');

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
					return { issueId: issue.id, summary: issue.fields.summary, shortSummary: shorterSummary, tense: -1, users: [], votes: [], finalScore: 0 };
				} else {
					console.log("Rejecting: ", issue.id, " because it has estimate: ", issue.fields.customfield_10020);
					return null;
				}
			}
		})
	}
	static updateJiraIssue(jiraUrl, jiraLogin, jiraPassword, issueIdOrKey) {
		var url = jiraUrl + "/rest/api/3/issue/" + issueIdOrKey;
		var update = {
			"fields": {
				"customfield_10020": 3,
			}
		};

		request({
			url: url,
			method: "PUT",
			json: true,
			body: update,
			auth: { user: jiraLogin, pass: jiraPassword }
		}, function (error, response, body) {
			console.log('error:', error); // Print the error if one occurred
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			console.log('body:', body); // Print the HTML for the Google homepage.
		}
		);
	}
}

module.exports = JiraManager;
