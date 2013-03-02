exports.index = function(req, res){
	res.sendfile('views/index.html');
};

exports.partials = function (req, res) {
	var name = req.params.name;
	res.sendfile('views/partials/' + name);
};

exports.images = function(req, res) {
	var name = req.params.name;
	console.log(name);
	res.sendfile('public/images/' + name);
}

exports.modulePartials = function (req, res) {
	console.log('public/modules/' + req.params.moduleName +'/' + req.params.name)
	var name = req.params.name;
	var moduleName = req.params.moduleName;
	res.sendfile('public/modules/'+ moduleName + '/partials/' + name);
};

exports.moduleImages = function (req, res) {
	var name = req.params.name;
	var moduleName = req.params.moduleName;
	res.sendfile('public/modules/'+ moduleName + '/images/' + name);
};