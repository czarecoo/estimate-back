const UserManager = require('./UserManager.js');
const JiraManager = require('./JiraManager.js');
const SessionManager = require('./SessionManager.js');
const UpdateFunctions = require('./UpdateFunctions.js');

class UserFunctions {
	static kickUser(userToKick, socketId, io) {
		var userAskingToKick = UserManager.getUserBySocketId(socketId);
		if (userAskingToKick != null) {
			if (userAskingToKick.isCreator) {
				UpdateFunctions.kickUser(userToKick, io)
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
				UpdateFunctions.updateFrontUsers(session, io);
			}
		}
	}
}

module.exports = UserFunctions;
