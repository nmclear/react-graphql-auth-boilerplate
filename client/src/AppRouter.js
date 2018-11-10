import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import requireAuth from './components/hoc/requireAuth';
import NavHeader from './components/NavHeader';
import AppNow from './components/App';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';

const client = new ApolloClient({
  dataIdFromObject: o => o.id
});

const AppRouter = () => (
  <ApolloProvider client={client}>
    <Router>
      <div>
        <NavHeader />
        <Switch>
          <Route exact path="/" component={AppNow} />
          <Route path="/login" component={LoginForm} />
          <Route path="/signup" component={SignupForm} />
          <Route path="/dashboard" component={requireAuth(Dashboard)} />
        </Switch>
      </div>
    </Router>
  </ApolloProvider>
);

export default AppRouter;
