const search = require('jira-search');
const request = require('request-promise');
const Story = require('./Story.js');

class JiraManager {
	static getIssues(jiraLogin, jiraPassword, jiraUrl, jiraProject) {
		return search({
			serverRoot: jiraUrl, user: jiraLogin, pass: jiraPassword, jql: 'project="' + jiraProject + '"', fields: '*all', expand: 'changelog', maxResults: 50, onTotal: function (total) { },
			mapCallback: function (issue) {
				if (issue.fields.customfield_10020 == null) {
					return new Story(issue.id, issue.fields.summary, true);
				} else {
					console.log("Rejecting: ", issue.id, " because it has estimate: ", issue.fields.customfield_10020);
					return null;
				}
			}
		})
	}
	static updateJiraIssue(jiraUrl, jiraLogin, jiraPassword, issueIdOrKey, finalScore) {
		var url = jiraUrl + "/rest/api/3/issue/" + issueIdOrKey;
		var update = {
			"fields": {
				"customfield_10020": finalScore,
			}
		};
		return request({
			url: url,
			method: "PUT",
			json: true,
			body: update,
			auth: { user: jiraLogin, pass: jiraPassword }
		}).then((error, response, body) => {
			console.log('error:', error); // Print the error if one occurred
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			console.log('body:', body); // Print the HTML for the Google homepage.);
		});
	}
	static createJiraIssue(jiraUrl, jiraLogin, jiraPassword, projectKey, shortSummary, summary, finalScore) {
		var url = jiraUrl + "/rest/api/3/issue/";
		var add = {
			"fields": {
				"project":
				{
					"key": projectKey
				},
				"summary": shortSummary,
				"issuetype": {
					"name": "Story",
					"description": summary
				},
				"customfield_10020": finalScore
			}
		};

		return request({
			url: url,
			method: "POST",
			json: true,
			body: add,
			auth: { user: jiraLogin, pass: jiraPassword }
		}).then((error, response, body) => {
			console.log('error:', error); // Print the error if one occurred
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			console.log('body:', body); // Print the HTML for the Google homepage.);
		});
	}
}

module.exports = JiraManager;
