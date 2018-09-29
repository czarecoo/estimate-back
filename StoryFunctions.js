class StoryFunctions{
    //te funkcje musza stąd znikanąć najlepiej do jakiejs klasy jako funkcje statyczne
    static vote(story, voteVal, sessionId) {
        for (var user of SessionManager.sessions.get(sessionId).users) {
            //emit do kazdego ziomka, ze inny ziomeczek puscil walju dla story
            //user.socketid.emit
        }
    }

    static coffee(sessionId) {
        for (var user of SessionManager.sessions.get(sessionId).users) {
            //emit z kofibrejkiem
        }
    }

    static kickUser(user) {
        io.to(user.socketid).emit("kickUser");
        for (var user of SessionManager.sessions.get(sessionId).users) {
            updateFrontUser(user);
        }
    }

    static passCreator(story, sessionId, newCreator) {
        if (SessionManager.sessions.has(sessionId)) {
            for (var user of SessionManager.sessions.get(sessionId).users) {
                if (user.name === newCreator.name) { //sprawdzamy czy jest taki user
                    SessionManager.sessions.get(sessionId).creator = user;
                }
            }
        }
    }

    static finishStory(story, sessionId) {

        updateFrontUsers(SessionManager.sessions.get(sessionId));
    }

    static markAsFuture(story, sessionId) {

        updateFrontUsers(SessionManager.sessions.get(sessionId));
    }

    static revoteStory(story, sessionId) {

        updateFrontUsers(SessionManager.sessions.get(sessionId));
    }

    static addEmptyStory(sessionId) { //jak dajemy empty to bez story

        updateFrontUsers(SessionManager.sessions.get(sessionId));
    }

    static savesStory(story, sessionId) {

        updateFrontUsers(SessionManager.sessions.get(sessionId));
    }

    static finalVote(story, sessionId) {

        updateFrontUsers(SessionManager.sessions.get(sessionId));
    }
}
