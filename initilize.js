dbTier = require('./persistence/mongoDBTier');

var admin = {
	"name" : "Admin",
	"email" : "admin@seed.com",
	"password" : "admin",
	"approval" : true,
	"role" : 'Admin'
};

dbTier.upsertUser(admin, function (result) {
	console.log(result);
});