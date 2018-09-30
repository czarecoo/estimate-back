class UpdateFuncions {
    static updateFrontUsers(session, io) {
        for (var user of session.users) {
            if(user.isCreator){
                UpdateFuncions.updateFrontCreator(user, session, io);
                continue;
            }
            UpdateFuncions.updateFrontUser(user, session, io);
        }
    }
    
    static updateFrontCreator(creator, session, io){
        var data = { //tylko poglądowo
            login: "czareg",
            userId: 1234,
            sessionId: 134134,
            isSuperUser: true,
            currentStory: [{ tense: 0, issueId: "I-11119", summary: "AsdasdasdasdasdddbAsdasdasdasdasdddb", shortSummary: "Asdasdasdasdasdddb...", users: [{ name: "MICHAU" }, { name: "Robak" }], votes: [3, 5], finalScore: 0 }],
            userList: [{ name: "Czareg", isActive: false, isCreator: true }, { name: "Wojteg", isActive: true, isCreator: false }],
            futureStories: [{ tense: -1, issueId: "I-91919", summary: "blellbelleblelbblellbelleblelb", shortSummary: "blellbelleblelb..." }],
            pastStories: [{ tense: 1, issueId: "I-42319", summary: "HelpHelpHelpHelpHelpHelpHelpHelpHelp", shortSummary: "Help...", users: [{ name: "Czareg" }, { name: "Bozena" }], votes: [0, 5], finalScore: 1 }]        
        }
        io.to(creator.socketid).emit("updateResponse", data);
    }

    static updateFrontUser(user, session, io) {
        var data = {
            login: "czareg",
            userId: 1234,
            sessionId: 134134,
            isSuperUser: false,
            currentStory: [{ summary: "AsdasdasdasdasdddbAsdasdasdasdasdddb"}],
            userList: [{ name: "Czareg", isActive: false, isCreator: true }, { name: "Wojteg", isActive: true, isCreator: false }],
        }
        io.to(user.socketid).emit("updateResponse", data);
    }
}
module.exports = UpdateFuncions;