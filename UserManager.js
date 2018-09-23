class UserManager {
	static createCreator(userName, socketid) {
		var creator = UserManager.createUser(userName, socketid);
		creator.isCreator = true;
		return creator;
	}
	static createUser(userName, socketid) {
		var user = { name: userName, isActive: true, isCreator: false, socketid: socketid };
		return user;
	}
}

module.exports = UserManager;
