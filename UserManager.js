class UserManager {
	static createCreator(userName) {
		var creator = UserManager.createUser(userName);
		creator.isCreator = true;
		return creator;
	}
	static createUser(userName) {
		var user = { name: userName, isActive: true, isCreator: false };
		return user;
	}
}

module.exports = UserManager;
