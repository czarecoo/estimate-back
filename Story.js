const MAX_CHARS_SHORT_SUMARY = 32;

class Story {
	constructor(issueId, summary, doesExist) {
		this.issueId = issueId;
		this.summary = summary;
		if (summary.length > MAX_CHARS_SHORT_SUMARY) {
			this.shortSummary = summary.substring(0, MAX_CHARS_SHORT_SUMARY) + "...";
		} else {
			this.shortSummary = summary;
		}
		this.tense = -1;
		this.users = new Array();
		this.votes = new Array();
		this.finalScore = 0;
		this.doesExist = doesExist;
	}
}
module.exports = Story;