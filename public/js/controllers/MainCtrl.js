angular.module('MainCtrl', []).controller('MainController', ['$scope', '$route', 'socket', 'localStorageService', function ($scope, $route, socket, localStorageService) {

	$scope.clearHistory = function() {
		if (localStorageService.isSupported) {
			localStorageService.remove('keywords');
			localStorageService.remove('tweets');
		} 
		$route.reload(); // reload view (easiest way to clear view)
	}

	$scope.keywords = '...';
	if (localStorageService.isSupported) {
		var storedKeywords = localStorageService.get('keywords');
		if (storedKeywords !== null) { // already have keywords in this session, no need to wait for socket message
			$scope.keywords = storedKeywords;
			$scope.status = 'Listening...';
		}
	}
	socket.on('keywords', function(words){
		if ($scope.keywords == '...') { // if not already displayed keywords in view
			var wordListStr = '';
			for (var c = 0; c < words.length; c++) { // convert words object into a list string
				wordListStr = wordListStr + words[c] + ', ';
			}
			wordListStr = wordListStr.slice(0,-2); // remove trailing comma and space
			$scope.keywords = wordListStr;
			if (localStorageService.isSupported) {
				localStorageService.set('keywords', wordListStr); // save keywords to localStorage
			}
			$scope.status = 'Listening...'; // now that keywords are shown, update status
		}
	});

    $scope.tweets = [];
    displayedTweets = [];
    if (localStorageService.isSupported) {
    	var analyzedTweets = localStorageService.get('tweets');
    	if (analyzedTweets !== null) { 
    		analyzedTweets = JSON.parse(analyzedTweets);
    		for (var t = 0; t < analyzedTweets.length; t++) { // display all previous analyzed tweets
    			if (displayedTweets.indexOf(analyzedTweets[t].id) < 0) {
    				displayedTweets.push(analyzedTweets[t].id);
	     			$scope.tweets.push({sentimentClass: analyzedTweets[t].sentimentClass, content: analyzedTweets[t].content, id: analyzedTweets[t].id});
	     		}
    		}
    	}
    }
	socket.on('stream', function(classification, text, tweetId){
		if (displayedTweets.indexOf(tweetId) < 0) {
			displayedTweets.push(tweetId);
			var sentimentViewClass;
			if (String(classification).toLowerCase() == 'positive') {
				sentimentViewClass = 'alert-success';
			} else if (String(classification).toLowerCase() == 'negative') {
				sentimentViewClass = 'alert-danger';
			} else {
				sentimentViewClass = 'alert-warning';
			}		
			if (localStorageService.isSupported) {
				// add tweet to localStorage
				var storedTweets = localStorageService.get('tweets');
				if (storedTweets === null) { // no stored tweets yet
					storedTweets = []; // initialise as an array
				} else {
					storedTweets = JSON.parse(storedTweets);
				}
				storedTweets.push({sentimentClass: sentimentViewClass, content: text, id: tweetId}); // add to tweets stored so far
				localStorageService.set('tweets', JSON.stringify(storedTweets));
			}
			// $scope.tweets.push({sentimentClass: sentimentViewClass, content: text, id: tweetId}); // add tweet to view
			$route.reload(); // for some reason, above doesn't work; so must reload each time to display tweets from storage
		}
	});
}]);