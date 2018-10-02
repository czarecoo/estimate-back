const SessionManager = require('./SessionManager.js');
const User = require('./User.js');

class UserManager {
	static createCreator(userName, socketId) {
		var creator = UserManager.createUser(userName, socketId);
		creator.isCreator = true;
		return creator;
	}
	static createUser(userName, socketId) {
		var user = new User(userName, socketId)
		return user;
	}
	static findUser(session, userName, userId) {
		for (var user of session.users) {
			if (user.name == userName && user.userId == userId) {
				return user;
			}
		}
		return null;
	}
	static getUserBySocketId(socketId) {
		var mapOfSessions = SessionManager.sessions;
		for (var session of mapOfSessions.values()) {
			for (var user of session.users) {
				if (user.socketId == socketId) {
					return user;
				}
			}
		}
		return null;
	}
}

module.exports = UserManager;
