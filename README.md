# starter-twitter-sentiment-app
### A starter Twitter sentiment analysis app

This is a simple application using the MEAN stack (MongoDB, ExpressJS, AngularJS, Node.js) to serve as a foundation to help you start building more complex Twitter sentiment analysis projects. 

![screenshot](https://github.com/jamba-ca/starter-twitter-sentiment-app/blob/master/assets/screenshot1.png)

## Installation
1. Download the repository
2. Install npm modules: `npm install`
3. Install bower dependencies `bower install`
4. Enter your Twitter app keys and auth token in `config/twitter.js` 
5. Start up the server: `node server.js`
6. View in a browser at http://localhost:8080

## To do
1. Make tweet filters modifiable (keywords, location)
2. Save tweets to a MongoDB database
3. Display statistics on positive vs. negative

## Notes
1. Only collects tweets in english since stop word list is for english
2. To modify the keyword and location filters, see `app/classifier.js`

If you have any questions or requests, email [dev@jamba.ca](mailto:dev@jamba.ca).