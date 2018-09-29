const SessionManager = require('./SessionManager.js');
const util = require('util');
class IntervalFunctions{
    static doPingRequest(io){
        setInterval(function(){//pinger
            var mapOfSessions = SessionManager.sessions;
            for(var session of mapOfSessions.values()){
                for(var user of session.users){
                    var act = user.isActive;
                    if(act > 0){
                        user.isActive = act - 1;
                    }
                    io.to(user.socketId).emit('ping_request');
                }
            }
        }, 1000);
    }
    static doLogger(){
        var counter = 0;
        setInterval(function(){//logger
            var mapOfSessions = SessionManager.sessions;
            console.log(counter++);
            console.log(util.inspect(mapOfSessions, false, null));
        }, 5000);
    }
    static doUpdate(){
        setInterval(function(){//updater
            var mapOfSessions = Session.sessions;
            for(var session of mapOfSessions.values()){
                var arrayOfActiveUsers = session.users;
                var arrayOfUsers = UserReq.makeArrayOfNicknameUsers(session.getMapOfUsers.values());
                for(var user of session.mapOfUsers.values()){
                    io.to(user.getSocketId).emit('user:change', arrayOfUsers, arrayOfActiveUsers, session.getSessionId);
                }
            }
        }, 150);
    }
}

module.exports = IntervalFunctions;