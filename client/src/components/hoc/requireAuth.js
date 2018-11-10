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
      const { loading, currentUser } = this.props.data;
      if (!loading && currentUser) {
        return <WrappedComponent {...this.props} />;
      }

      return <div />;
    }
  }

  return graphql(CurrentUserQuery)(RequireAuth);
};
