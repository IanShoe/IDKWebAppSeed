module.exports = function(dbTier) {
	return {
		saveUser: function(req, res) {
			var user = req.body;
			var newUser = false;
			if(user._id == undefined){
				user.admin = false;
				user.approval = false;
				newUser = true;
			}
			dbTier.upsertUser(user, function(response){
				res.send(response);
			});
			return newUser;
		},
		getAllUsers: function(req, res){
			dbTier.getAllUsers(function(response){
				res.send(response);
			});
		},
		updateAllUsers: function(req, res){
			dbTier.updateAllUsers(req.body, function(response){
				res.send(response);
			});
		}
	};
};