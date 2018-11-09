const graphql = require('graphql');

const { GraphQLString } = graphql;

const UserType = require('./../../types/user_type');
const AuthService = require('./../../../services/auth');

module.exports = {
  type: UserType,
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve(parentValue, args, req) {
    const { email, password } = args;
    return AuthService.signup({ email, password, req });
  },
};
