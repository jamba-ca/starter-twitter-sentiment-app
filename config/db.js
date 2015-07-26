module.exports = {

	// url : 'mongodb://<user>:<pass>@some.remote.server.com:27017/database_name',
	url : 'mongodb://localhost:27017/TwitterSentiment', // typical local setup with MongoDB server noauth config set to true

	options : {},

	schemaTweet : {
		keyWords : [String],
		latLng : [Number],
		tweetId : Number,
		tweetDate : Date,
		tweetTest : String,
		tweetSentiment : Number, // 1 for positive, -1 for negative, 0 for neutral/unknown
		userId : Number
	},
	
	collectionName : 'tweets'

}