class IssueFront{
    static get LENGTH_SHORT_SUMMARY(){
        return 32;
    }
    constructor(id, summary){
        this.issueId = id;
        this.summary = summary;
        this.shortSummary = this.summary.substr(0, IssueFront.LENGTH_SHORT_SUMMARY); 
    }

    get getIssueId(){
        return this.issueId;
    }
    get getSummary(){
        return this.summary;
    }
    get getShortSummary(){
        return this.shortSummary;
    }
    description(){
        return this.issueId + ", " + this.summary + ", " + this.shortSummary;
    }
}

module.exports = IssueFront;