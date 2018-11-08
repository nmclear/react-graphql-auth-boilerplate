const UserType = require('./../../types/user_type');

module.exports = {
  type: UserType,
  resolve(parentValue, args, req) {
    const { user } = req;
    req.logout();
    return user;
  },
};
