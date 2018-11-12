const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

const { Schema } = mongoose;

// UserSchema for Login
const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Middleware for before save to hash/salt password.
// Before saving, salt and hash password so it cannot be stored as plain text.
// Pre middleware functions are executed one after another, when each middleware calls next.
UserSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  return bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    return bcrypt.hash(user.password, salt, null, (error, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      return next();
    });
  });
});

// Hashes plain password and compares with stored password. Password never compared in plain form
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
