var mongo = require('mongodb');
var nconf = require('nconf');

var MongoDBTier = function() {
	nconf.use('file', { file: './config.json' });
	nconf.load();

	console.log('Using mongo URL: ' + nconf.get('mongo:url'));
	console.log('Using mongo Port: ' + nconf.get('mongo:port'));
	console.log('Using mongo Database: ' + nconf.get('mongo:db'));

	this.url = nconf.get('mongo:url');
	this.port = parseInt(nconf.get('mongo:port'));
	this.database = nconf.get('mongo:db');

	var server = new mongo.Server(this.url, this.port, {auto_reconnect: true});
	this.db = new mongo.Db(this.database, server);
};

MongoDBTier.prototype.getInfo = function() {
	return this.url + ' ' + this.port + ' ' + this.database;
};

MongoDBTier.prototype.getUserByEmail = function(email, callback) {
	this.db.collection('users', function(err, collection) {
		var query = {email: email};
		if (err) { 
			console.warn('Get Collection Error:' + err);
			callback(null);
		} else {
			collection.findOne( query, function (err, doc){
				if (err) {console.warn('findOne Error:' + err); callback(null);}
				else {
					callback(doc)
				}
			});	
		}
	});
};


//Needs improving : Couldn't get upsert:true to work
MongoDBTier.prototype.upsertUser = function(user, callback) {
	this.db.collection('users', function(err, collection) {
		var query = {email: user.email};
		if (err) { 
			console.warn(err);
			callback(false);
		} else {
			collection.find(query).count(function(err, count) {
				if (count == 0) {
					collection.insert(user, {safe:true},function(err, objects) {
						if (err) {
							console.warn(err);
							callback(false);
						} else {
							callback(true);
						}
					});
				} else {
					collection.findOne( query, function (err, doc){
						if (err) {console.warn('findOne Error:' + err); callback(false);}
						else {
							collection.remove({_id:doc._id}, function(err, numberOfRemovedDocs) {
								if (err) {
									console.warn(err);
									callback(false);
								}
								collection.insert(user, {safe:true},function(err, objects) {
									if (err) {
										console.warn(err);
										callback(false);
									} else {
										callback(true);
									}
								});
							});
						}
					});	
				}
			});
		}
	});
};

MongoDBTier.prototype.updateAllUsers = function(users, callback){
	this.db.collection('users', function(err, collection) {
		if (err) { 
			console.warn(err);
			callback(null);
		} else {
			for (var i = 0; i < users.length; i++) {
				collection.update({name: users[i].name}, {$set: users[i]}, {safe:true}, function(err){
					if(err){
						console.warn(err);
						callback(false);
					}
					else{
						callback(true);
					}
				});
			}
		}
	});
};

MongoDBTier.prototype.getAllUsers = function(callback) {
	this.db.collection('users', function(err, collection) {
		if (err) { 
			console.warn(err);
			callback(null);
		} else {
			collection.find().toArray(function(err, results){
				if (err) {
					console.warn(err);
					callback(null); 
				} else {
					callback(results);
				}
			});
		}
	});
};

MongoDBTier.prototype.searchUsers = function(query, callback) {
	this.db.collection('users', function(err, collection) {
		if (err) { 
			console.warn(err);
			callback(null);
		} else {
			collection.find(query).toArray(function(err, results){
				if (err) {
					console.warn(err);
					callback(null); 
				} else {
					callback(results);
				}
			});
		}
	});
};


module.exports = new MongoDBTier();