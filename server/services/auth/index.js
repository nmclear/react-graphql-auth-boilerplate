const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('./../../db/models');

// Use user ID to save identifying token in user session.
// https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Give only user's ID, return user object (placed on req.user)
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Instructs Passport how to authenticate a user using a locally saved email and password.
// Called whenever a user attempts to login.
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // check MongoDB for UserModel by email
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        // done callback sent back to GraphQL client.
        return done(null, false, 'Invalid username or password');
      }
      // if found email in db...
      return user.comparePassword(password, (error, isMatch) => {
        if (error) {
          return done(error);
        }
        if (isMatch) {
          // When Passport authenticates a request, it parses the credentials contained in the request.
          // It then invokes the verify callback with those credentials as arguments, in this case username and password.
          // If the credentials are valid, the verify callback invokes done to supply Passport with the user that authenticated.
          return done(null, user);
        }
        return done(null, false, 'Invalid username or password');
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
  // check if email already exists in database.
  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new Error('Email is already in use.');
      }
      // if not in use, save user.
      return user.save();
    })
    .then(
      // Must create a Promise here b/c Passport only supports callbacks,
      // while GraphQL only supports promises for async code.
      user => new Promise((resolve, reject) => {
        // the user saved above is  applied to req.logIn
        // creates login session (part of Passport)
        req.logIn(user, (err) => {
          if (err) {
            reject(err);
          }
          resolve(user);
        });
      }),
    );
}

// Logs user in invoking the local-strategy above.
function login({ email, password, req }) {
  // Must create a Promise here b/c Passport only supports callbacks,
  // while GraphQL only supports promises for async code.
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user) => {
      if (!user) {
        reject('Invalid username or password');
      }

      req.login(user, () => resolve(user));
    })({ body: { email, password } });
  });
}

function logout(req) {
  // pull user out before logout out of session.
  const { user } = req;
  // Passport terminates a login session.
  req.logout();
  // user that just logged out.
  return user;
}

module.exports = { signup, login, logout };
