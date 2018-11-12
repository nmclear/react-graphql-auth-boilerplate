const UserType = require('./../../types/user_type');
const AuthService = require('./../../../services/auth');

module.exports = {
  type: UserType,
  resolve(parentValue, args, req) {
    return AuthService.logout(req);
  },
};
