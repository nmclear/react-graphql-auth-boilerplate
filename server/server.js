const express = require('express');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const webpackMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const passportConfig = require('./services/auth/index');
const models = require('./db/models');
const schema = require('./graphql/schema');

const PORT = process.env.PORT || 3001;
// Create Express App
const app = express();

// Unique mLab URI
const MONGO_URI = '';

// Replace Mongoose's deprecated promise library with ES6 Promise
mongoose.Promise = global.Promise;

// MongoDB CONNECTION
mongoose.connect(MONGO_URI);
mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', error => console.log('Error connecting to MongoLab:', error));

// Configures app to use sessions. Encrypted ID on the users cookie.
// Modifies request object to tell which user made the request.
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: 'aaabbbccc',
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

// Send all '/graphql' routes to GraphQL instance.
app.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: true,
  }),
);

// Webpack middleware to respond with webpack output from root route requests.
const webpackConfig = require('../webpack.config.js');

app.use(webpackMiddleware(webpack(webpackConfig)));

// module.exports = app;

app.listen(PORT, () => {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
