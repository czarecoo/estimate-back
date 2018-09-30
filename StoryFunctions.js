const UpdateFunctions = require('./UpdateFunctions.js');
const SessionManager = require('./SessionManager.js');

class StoryFunctions{
    //te funkcje musza stąd znikanąć najlepiej do jakiejs klasy jako funkcje statyczne
    static vote(story, voteVal, sessionId, io) {
        //dodanie po stronie backu wszystkich informacji
        UpdateFunctions.updateFrontUsers(SessionManager.sessions.get(sessionId), io);
    }

    static coffee(sessionId, io) {
        for (var user of SessionManager.sessions.get(sessionId).users) {
            io.to(user.socketid).emit("coffeeResponse");
        }
    }

    static kickUser(user, io) {
        io.to(user.socketid).emit("kickUser");
        for (var user of SessionManager.sessions.get(sessionId).users) {
            updateFrontUser(user);
        }
    }

    static passCreator(story, sessionId, newCreator, io) {
        if (SessionManager.sessions.has(sessionId)) {
            for (var user of SessionManager.sessions.get(sessionId).users) {
                if (user.name === newCreator.name) { //sprawdzamy czy jest taki user
                    SessionManager.sessions.get(sessionId).creator = user;
                }
            }
            UpdateFunctions.updateFrontUsers(SessionManager.sessions.get(sessionId), io);
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
