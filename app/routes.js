module.exports = function(app) {

	// modules =================================================================
	var path = require('path');
	
	// server routes ===========================================================
	// handle things like api calls and authentication routes
	

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendFile(path.join(__dirname + '/../public/index.html'));
	});
	
};