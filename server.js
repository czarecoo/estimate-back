var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var search = require('jira-search');

var port = 8080;
var jiralogin = "adam96stan@gmail.com";
var jirapassword = "Cedynia97@";
var jiraurl = "https://adamjestem.atlassian.net";
var jiraproject = "ToTylkoDoPobrania";

const MAX_CHARS_SHORT_SUMARY = 32;
var issuesForFront = getIssuesFromJira("loginJakisWymyslony",jiraurl,jiralogin,jirapassword,jiraproject);

function getIssuesFromJira(login,jiraurl,jiralogin,jirapassword,jiraproject){
	search({ 
		serverRoot: jiraurl, user: jiralogin, pass: jirapassword, jql: 'project="'+jiraproject+'"', fields: '*all', expand: 'changelog', maxResults: 50, onTotal: function (total) {},
		mapCallback: function (issue) {
		//if(issue=="nie jest zestymowany")
		  return issue;
		}
	  }).then(function (issues) {
		tempIssues=[];
		for(var i = 0; i < issues.length; i++){
			var issue = {issueId: issues[i].id, summary: issues[i].fields.description ,shortSummary: issues[i].fields.description.substring(0, MAX_CHARS_SHORT_SUMARY)+"..." };
			tempIssues.push(issue);
			console.log(issue);
		}
		return tempIssues;
	}).done();
}
