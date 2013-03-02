var express = require('express'),
routes = require('./routes'),
dbTier = require('./persistence/mongoDBTier'),
userService = require('./services/user')(dbTier),
loginService = require('./services/login')(dbTier),
nodemailer = require('nodemailer'),
mailService = nodemailer.createTransport("sendmail");

var app = module.exports = express();
// Configuration
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
	
app.configure('production', function(){
	app.use(express.errorHandler());
});
// Routes
//TODO: Maybe the routes that resolve within the service should instead be resolved here.
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);
app.get('/images/:name', routes.images);
app.get('/modules/:moduleName/partials/:name', routes.modulePartials);
app.get('/modules/:moduleName/images/:name', routes.moduleImages);
app.post('/User', function(req, res){
	var newUser = userService.saveUser(req, res);
	var message = {
		from: "IDK Admin <iss90@idk.com>",
		to: req.body.email
	}
	if(newUser){
		message.subject = "Acount Created for IDK App";
		message.text = "Your account has been created for IDK App.";
	}
	else{
		message.subject = "Acount Updated for IDK App";
		message.text = "Your credentials have been updated for IDK App.";
	}
	mailService.sendMail(message);
});
app.post('/getUsers', userService.getAllUsers); //Get all Users
app.post('/updateUsers', userService.updateAllUsers); //Update all users
app.post('/login', loginService.login); //Check user for validity and grant session token
app.post('/logout', loginService.logout); //Remove user session token
app.post('/resetPass', function(req, res){
	dbTier.getUserByEmail(req.body.email, function(user){
		if(user){
			var resetPassword = generatepass();
			user.password = resetPassword;
			dbTier.upsertUser(user, function(response){
				if(response){
					var message = {
						from: "IDK Admin <iss90@idk.com>",
						to: req.body.email,
						subject: "Password Reset",
						text: "Your password has been reset.\n password: " + resetPassword + "\n Use this password next time you login."
					}
					mailService.sendMail(message);
					res.send(200, { success: 'Password Reset' });
				}
				else{
					res.send(200, { error: 'Password Reset Error' });	
				}
			})
		}
		else{
			res.send(200, { error: 'User Not Found' });
		}
		
	});
});

// Some Cookie Examples
// res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true });
// res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server
app.listen(3000, function(){
	console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


function generatepass(){
	var temp=''
	var keylist="abcdefghijklmnopqrstuvwxyz123456789"
	for (i=0;i<6;i++)
		temp+=keylist.charAt(Math.floor(Math.random()*keylist.length))
	return temp;
}