const SessionManager = require('./SessionManager.js');
const util = require('util');
const UpdateFunctions = require('./UpdateFunctions.js')
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
                    else {
                        UpdateFunctions.updateFrontUsers(session, io);
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
}

module.exports = IntervalFunctions;