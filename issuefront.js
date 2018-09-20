class IssueFront{
    static get LENGTH_SHORT_SUMMARY(){
        return 32;
    }
    constructor(id, summary){
        this.issueId = id;
        this.summary = summary;
        this.shortSummary = summary.substring(IssueFront.LENGTH_SHORT_SUMMARY); 
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
}

module.exports = IssueFront;