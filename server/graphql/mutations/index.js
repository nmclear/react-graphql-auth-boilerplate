const graphql = require('graphql');

const { GraphQLObjectType } = graphql;

const signup = require('./auth/signup');
const logout = require('./auth/logout');
const login = require('./auth/login');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup,
    logout,
    login,
  },
});

module.exports = mutation;
