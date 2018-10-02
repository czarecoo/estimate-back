const SessionManager = require('./SessionManager.js');
const util = require('util');
const UpdateFunctions = require('./UpdateFunctions.js');
const UserManager = require('./UserManager.js');
const AFTER_HOW_LONG_WE_SHOULD_DELETE_SESSION_WITH_INACTIVE_USERS = 30 * 60 * 1000; //30min

class IntervalFunctions {
	static doPingRequest(io, time) {
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
		}, time);
	}
	static raiseActivity(socketId) {
		var user = UserManager.getUserBySocketId(socketId);
		if (user != null) {
			user.activityLevel += 2;
			if (user.activityLevel > 5) {
				user.activityLevel = 5;
			}
			if (user.activityLevel > 3 && user.isActive == false) {
				user.isActive = true;
			}
		}
	}
	static doLogger(time) {
		var counter = 0;
		setInterval(function () {
			var mapOfSessions = SessionManager.sessions;
			console.log(counter++);
			console.log(util.inspect(mapOfSessions, false, 3));
		}, time);
	}
	static clearStaleSessions(time) {
		setInterval(function () {
			var mapOfSessions = SessionManager.sessions;
			var timeNow = new Date();
			for (var session of mapOfSessions.values()) {
				var activeUserCount = 0;
				for (var user of session.users) {
					if (user.isActive || Math.abs(timeNow - user.timeOfLastUpdate) < AFTER_HOW_LONG_WE_SHOULD_DELETE_SESSION_WITH_INACTIVE_USERS) {
						activeUserCount++;
						break;
					}
				}
				if (activeUserCount == 0) {
					console.log("Deleting session: " + session.sessionId);
					SessionManager.sessions.delete(session.sessionId);
					SessionManager.setOfSessionIds.delete(session.sessionId);
				}
			}
		}, time);
	}
}

module.exports = IntervalFunctions;