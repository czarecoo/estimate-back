const SessionManager = require('./SessionManager.js');
const simpleid = require("simple-id");

class UserManager {
	static createCreator(userName, socketId) {
		var creator = UserManager.createUser(userName, socketId);
		creator.isCreator = true;
		return creator;
	}
	static createUser(userName, socketId) {
		var user = { name: userName, userId: UserManager.generateUserId(), isActive: true, activityLevel: 5, isCreator: false, socketId: socketId };
		return user;
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
	static generateUserId() {
		while (true) {
			var id = simpleid(4, '6789');
			if (!SessionManager.setOfUserIds.has(id)) {
				SessionManager.setOfUserIds.add(id);
				return id;
			}
		}
	}
}

module.exports = UserManager;
