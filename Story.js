class Story {
	constructor(summary, description, doesExist, id) {
		this.summary = summary;
		this.description = description;
		this.tense = -1;
		this.users = new Array();
		this.votes = new Array();
		this.finalScore = 0;
		this.doesExist = doesExist;
		this.id = id;
	}
}
module.exports = Story;