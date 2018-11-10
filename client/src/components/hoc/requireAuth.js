import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import CurrentUserQuery from './../../api/queries/CurrentUser';

export default WrappedComponent => {
  class RequireAuth extends Component {
    componentDidUpdate() {
      const { data, history } = this.props;
      const { loading, currentUser } = data;
      if (!loading && !currentUser) {
        history.push('/login');
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return graphql(CurrentUserQuery)(RequireAuth);
};
