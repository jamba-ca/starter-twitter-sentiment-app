# starter-twitter-sentiment-app
### A starter Twitter sentiment analysis app

This is a simple application using the MEAN stack (MongoDB, ExpressJS, AngularJS, Node.js) to serve as a foundation to help you start building more complex Twitter sentiment analysis projects.

Tweets are filtered by keyword and geolocation from the Twitter Streaming API, then classified for positive or negative sentiment. Analyzed tweets are stored by the server app to a MongoDB collection. Client-side, if the accessing browser is HTML5 compliant, tweets are cached to localStorage.

![screenshot](https://github.com/jamba-ca/starter-twitter-sentiment-app/blob/master/assets/screenshot1.png)

## Installation
1. Clone or download the repository
2. Install npm modules: `npm install`
3. Install bower dependencies `bower install`
4. Enter your Twitter app keys and auth token in `config/twitter.js` 
5. [Optional] Edit the URL to your MongoDB server in `config/db.js` 
6. Start up the server: `node server.js`
7. View in a browser at http://localhost:8080

## To do
1. Make tweet filters modifiable in UI (keywords, location)
2. Display statistics on positive vs. negative

## Notes
1. Only collects tweets in english since stop word list is for english
2. To modify the keyword and location filters, see `app/classifier.js`

If you have any questions or requests, email [dev@jamba.ca](mailto:dev@jamba.ca).