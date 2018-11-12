// @flow
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';

import LogoutMutation from './../api/mutations/Logout';
import CurrentUserQuery from './../api/queries/CurrentUser';

type Props = {
  mutate: Function,
  data: Object
};

type State = {};

class NavHeader extends Component<Props, State> {
  onLogoutClick() {
    const { mutate } = this.props;
    mutate({
      refetchQueries: [{ query: CurrentUserQuery }]
    });
  }

  renderButtons() {
    const { data } = this.props;
    const {
      loading,
      currentUser
    }: { loading: boolean, currentUser: Object } = data;

    if (loading) {
      return <div />;
    }

    if (currentUser) {
      return (
        <li>
          <a onClick={this.onLogoutClick.bind(this)}>Logout</a>
        </li>
      );
    } else {
      return (
        <div>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          <li>
            <Link to="login">Log In</Link>
          </li>
        </div>
      );
    }
  }

  render() {
    return (
      <nav>
        <div>
          <ul>
            <Link to="/">Home</Link>
            <ul>{this.renderButtons()}</ul>
          </ul>
        </div>
      </nav>
    );
  }
}

export default graphql(LogoutMutation)(graphql(CurrentUserQuery)(NavHeader));
