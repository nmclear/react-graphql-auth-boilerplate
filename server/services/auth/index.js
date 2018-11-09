const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('./../../db/models');

// Use user ID to save identifying token in user session.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Give only user's ID, return user object (placed on req.user)
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Instructs Passport how to authenticate a user using a locally saved email and password
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, 'Invalid Credentials');
      }
      return user.comparePassword(password, (error, isMatch) => {
        if (error) {
          return done(error);
        }
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, 'Invalid credentials.');
      });
    });
  }),
);

// Creates a new user account.
function signup({ email, password, req }) {
  const user = new User({ email, password });
  if (!email || !password) {
    throw new Error('You must provide an email and password.');
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new Error('Email in use');
      }
      return user.save();
    })
    .then(
      user => new Promise((resolve, reject) => {
        req.logIn(user, (err) => {
          if (err) {
            reject(err);
          }
          resolve(user);
        });
      }),
    );
}

// Logs user in using passport local-strategy
function login({ email, password, req }) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user) => {
      if (!user) {
        reject('Invalid credentials.');
      }

      req.login(user, () => resolve(user));
    })({ body: { email, password } });
  });
}

module.exports = { signup, login };
