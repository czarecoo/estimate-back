const UserManager = require('./UserManager.js');
const SessionManager = require('./SessionManager.js');
const UpdateFunctions = require('./UpdateFunctions.js');

class UserFunctions {
	static kickUser(userToKick, socketId, io) {
		var userAskingToKick = UserManager.getUserBySocketId(socketId);
		var session = SessionManager.getSessionBySocketId(socketId);
		if (userAskingToKick != null) {
			if (userAskingToKick.isCreator) {
				SessionManager.removeUser(session, userToKick);
				UpdateFunctions.kickUser(userToKick, io);
				UpdateFunctions.updateFrontUsers(session, io);
			}
		}
	}
	static promoteUser(userToPromote, socketId, io) {
		var userAskingToPromote = UserManager.getUserBySocketId(socketId);
		var userToBePromoted = UserManager.getUserBySocketId(userToPromote.socketId)
		var session = SessionManager.getSessionBySocketId(socketId);
		if (userAskingToPromote != null && session != null && userToBePromoted != null) {
			if (userAskingToPromote.isCreator) {
				userAskingToPromote.isCreator = false;
				userToBePromoted.isCreator = true;
				UpdateFunctions.showErrorToUser(userToPromote, "You have been promoted to session creator.", io);
				UpdateFunctions.updateFrontUsers(session, io);
			}
		}
	}
	static setInactive(socketId, io) {
		var user = UserManager.getUserBySocketId(socketId);
		var session = SessionManager.getSessionBySocketId(socketId);
		if (user != null && session != null && user.isActive) {
			user.isActive = false;
			user.activityLevel = 0;
			UpdateFunctions.updateFrontUsers(session, io);
		}
	}
}

module.exports = UserFunctions;
