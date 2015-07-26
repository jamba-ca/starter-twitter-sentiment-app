// modules =================================================

var express           = require('express');
var app               = express();
var mongoose          = require('mongoose');
var http 		      = require('http');
var socketio          = require('socket.io');
var natural           = require("natural"); // a general natural language facility for Node.js
var tweetPreProcessor = require('./utils/preprocessor');
var twitBot           = require('./utils/twit-bot');
var emojiStripper     = require('emoji-strip');
    
// configuration ===========================================
	
// config files
var dbConfig = require('./config/db');
var twitterConfig = require('./config/twitter');

var port = process.env.PORT || 8080; // set app listening port

// middleware ==============================================

app.use(express.static(__dirname + '/public')); // set the static files location; e.g. /public/img will be /img for users

// routes ==================================================

require('./app/routes')(app); // pass our application into our routes

// initializations & start services ========================

// init web sockets
var server = http.createServer(app);
var io = socketio.listen(server);
io.sockets.on('connection', function(socket) {
	console.log('New client browser connection established. [socket.id: '+socket.id+']');
})

// start twitter listener
var twitterBot = new twitBot(twitterConfig);

// init tweet preprocessor
var preProcessor = tweetPreProcessor.getInstance();

// start app ===============================================

server.listen(port);
console.log('Listening for client browser connections on port '+port+'.'); 				
exports = module.exports = app; // expose the app

// connect to mongoDB database
mongoose.connect(dbConfig.url, dbConfig.options);
var db = mongoose.connection;
db.on('error', function (err) {
	console.log('Could not connect to MongoDB server. Tweets will not be saved.');
});
db.once('open', function() {
	console.log('Connected to MongoDB server.');
});

// start natural language classifier
require('./app/classifier')(natural, preProcessor, twitterBot, emojiStripper, mongoose, dbConfig, io);
