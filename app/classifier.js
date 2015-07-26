module.exports = function(natural, preProcessor, twitterBot, emojiStripper, mongoose, dbConfig, io) {

	// create tweet model
	var tweetSchema = new mongoose.Schema(dbConfig.schemaTweet);
	var tweetModel = mongoose.model(dbConfig.collectionName, tweetSchema);

	var lastTweetId = 0; // to prevent duplicate tweets (received one after the other) from being processed

	var classifier = new natural.BayesClassifier();
	natural.BayesClassifier.load('./assets/classifier.json', null, function(err, classifier) {  
		console.log('Loaded tweet classifier.');  

		// Topic keywords we are interested in
		var keyWords = ["car","cars"]; 
		
		// Locations we are interested in
		// Bounding boxes SW, NE
		var geoBox_NewYork = [-74,40,-73,41]; // New York City
		var geoBox_UnitedStates = [-178.214203,18.536892,-48.466812,71.406647];

		// According to https://dev.twitter.com/streaming/overview/request-parameters#locations
		// location does not act as filter for other filters (i.e. AND), Twitter considers it as an OR filter
		// -- Therefore, must get all tweets from a location, then filter by keywords ourselves later:
		var params = {locations: geoBox_UnitedStates, language: 'en'};
		// -- If not interested in geolocation (and/or to get more tweets, since not all tweets have geocoded information:
		// var params = {track: keyWords, language: 'en'};

		setInterval(function() {			
			io.sockets.emit('keywords', keyWords); // push keywords to web socket so can display in view
			// did this inside interval function to allow for possibility of dynamic keywords

			twitterBot.stream(params, function(tweet) {
				if ((!tweet.retweeted) && (tweet.text.substring(0,2).toUpperCase() != 'RT')) { // ignore retweets
					if (lastTweetId != tweet.id) { // ignore duplicates; sometimes saw duplicate tweets arrive via stream API...
						var classification, classificationNum;
						var text = emojiStripper(tweet.text);
						// run some pre-processing on the tweet
						var cleanTweet = preProcessor.cleanTweet(text);													
						// filter only tweets that contain keywords
						if (wordsInString(text, keyWords)) {
							classification = String(classifier.classify(cleanTweet)).toLowerCase();	
							switch (classification) {
								case 'positive':
									classificationNum = 1;
									break;
								case 'negative':
									classificationNum = -1;
									break;
								default:
									classificationNum = 0;
							}
							
							if (typeof tweet.id != 'undefined') { // check for valid tweet structure
								if (mongoose.connection.readyState > 0) { // we have a database connection open
									// save tweet to MongoDB
									console.log('Saving tweet [ID:'+tweet.id+'] to db.');
									var tweetCoords = [null, null]; // in case tweets don't have coordinates structure
									if (JSON.stringify(tweet.coordinates) !== 'null') {
										tweetCoords = [tweet.coordinates.coordinates[1],tweet.coordinates.coordinates[0]];
									}	
									var tweetToMongo = new tweetModel({
										keyWords : keyWords,
										latLng : tweetCoords,
										tweetId : tweet.id,
										tweetDate : tweet.created_at,
										tweetText : tweet.text,
										tweetSentiment : classificationNum,
										userId : tweet.user.id							
									});
									tweetToMongo.save(function (err, data) {
										if (err) console.log(err);
									});
								} else {
									console.log('Cannot save tweet [ID:'+tweet.id+'] to db.');
								}

								// send analyzed tweet to client via web socket
								io.sockets.emit('stream', classificationNum, text, tweet.id);

								console.log('['+classification+', Tweet ID:'+tweet.id+'] '+text);
								lastTweetId = tweet.id;
							}
						}
					}
				}
			});
		}, 3000); // do every 3 seconds
	});

	//@return a properly formatted date string for current time in EST
	function dateString() {
		var d = new Date(Date.now() - 5*60*60*1000);  // EST time zone
		return d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getDate();
	};

	// @param s - string to be compared
	// @param words - array of words to be tested
	// @return whether or not s contains any of the words in the words array
	function wordsInString(s, words) {
		var word;
		s = s.toLowerCase();
		for (var i=0; i<words.length; i++) {
			word = words[i].toLowerCase();
			if (new RegExp('\\b' + word + '\\b', 'i').test(s)) {
				return true;
			}
		}
		return false;
	};

};