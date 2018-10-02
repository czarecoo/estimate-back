const simpleid = require("simple-id");
const SessionManager = require('./SessionManager.js');

class User {
	constructor(userName, socketId) {
		this.name = userName;
		this.socketId = socketId;
		this.userId = this.generateUserId();
		this.isCreator = false;
		this.isActive = true;
		this.activityLevel = 5;
		this.timeOfLastUpdate = new Date();
	}
	generateUserId() {
		while (true) {
			var id = simpleid(4, '6789');
			if (!SessionManager.setOfUserIds.has(id)) {
				SessionManager.setOfUserIds.add(id);
				return id;
			}
		}
	}
}
module.exports = User;