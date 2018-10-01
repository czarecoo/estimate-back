const SessionManager = require('./SessionManager.js');
const util = require('util');
const UpdateFunctions = require('./UpdateFunctions.js');
const UserManager = require('./UserManager.js');

class IntervalFunctions {
	static doPingRequest(io) {
		setInterval(function () {
			var mapOfSessions = SessionManager.sessions;
			for (var session of mapOfSessions.values()) {
				for (var user of session.users) {
					if (user.activityLevel > 0) {
						user.activityLevel--;
					} else if (user.activityLevel == 0 && user.isActive == true) {
						user.isActive = false;
						UpdateFunctions.updateFrontUsers(session, io);
					}
					io.to(user.socketId).emit('activityRequest');
				}
			}
		}, 1000);
	}
	static raiseActivity(socketId) {
		var user = UserManager.getUserBySocketId(socketId);
		user.activityLevel += 2;
		if (user.activityLevel > 5) {
			user.activityLevel = 5;
		}
		if (user.activityLevel > 3 && user.isActive == false) {
			user.isActive = true;
		}
	}
	static doLogger(time) {
		var counter = 0;
		setInterval(function () {
			var mapOfSessions = SessionManager.sessions;
			console.log(counter++);
			console.log(util.inspect(mapOfSessions, false, null));
		}, time);
	}
}

module.exports = IntervalFunctions;