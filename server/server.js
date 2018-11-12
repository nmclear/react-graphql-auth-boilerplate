const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser');
const bodyParser = require('body-parser-graphql');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
require('dotenv').config();
// const passportConfig = require('./services/auth/');
// const models = require('./db/models');
const schema = require('./graphql/schema');

// Create Express App
const app = express();

// Unique mLab URI
const MONGO_URI = `${process.env.MONGO_URI}`;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(bodyParser.graphql());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./../client/build'));
}

// Replace Mongoose's deprecated promise library with ES6 Promise
// mongoose.Promise = global.Promise;

// MongoDB CONNECTION
mongoose.connect(
  MONGO_URI,
  { useNewUrlParser: true },
);
mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', error => console.log('Error connecting to MongoLab:', error));

// Configures app to use sessions. Encrypted ID on the users cookie.
// Modifies request object to tell which user made the request.
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET_KEY,
    store: new MongoStore({
      url: MONGO_URI,
      autoReconnect: true,
    }),
  }),
);

// Passport middleware to examine request's session
// Sets req.user to the current session user.
app.use(passport.initialize());
app.use(passport.session());

// Handle GraphQL Routes
app.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: true,
  }),
);

// Handle all other routes to React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './../client/build/index.html'));
});

module.exports = app;
