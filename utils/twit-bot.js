//
//  twit-bot
//  class for performing various Twitter actions
//
var Twit = require('twit');

var twitBot = module.exports = function(config) {
	this.twit = new Twit(config);
};

// Post a tweet [unused in this application, included for sake of interest]
twitBot.prototype.tweet = function (status, callback) {
	if (typeof status !== 'string') {
		return callback(new Error('Tweet must be of type String'));
	} else if(status.length > 140) {
		return callback(new Error('Tweet is too long: ' + status.length));
	}
	this.twit.post('statuses/update', {status: status}, callback);
};

// Search twitter for all tweets that satisfy the given params
twitBot.prototype.search = function (params, callback) { 
	this.twit.get('search/tweets', params, callback);
};

// Stream tweets given params
twitBot.prototype.stream = function (params, callback) {
	var stream = this.twit.stream('statuses/filter', params);
	stream.on('error', function(err){
		if (err.message.indexOf('401') >= 0) {
			console.log('Twitter authentication error.');
			process.exit(1); // kill server, no point in continuing
		} else {
			console.log(err.message);
		}
	});
	stream.on('tweet', callback);
};
