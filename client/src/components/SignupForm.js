import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import AuthForm from './AuthForm';

import SignupMutation from './../api/mutations/Signup';
import CurrentUserQuery from './../api/queries/CurrentUser';

class SignupForm extends Component {
  constructor(props) {
    super(props);

    this.state = { errors: [] };
  }

  componentDidUpdate(prevProps) {
    const { data, history } = this.props;
    if (!prevProps.data.currentUser && data.currentUser) {
      history.push('/dashboard');
    }
  }

  onSubmit({ email, password }) {
    const { mutate } = this.props;

    mutate({
      variables: { email, password },
      refetchQueries: [{ query: CurrentUserQuery }]
    }).catch(res => {
      const errors = res.graphQLErrors.map(error => error.message);
      this.setState({ errors });
    });
  }

  render() {
    const { errors } = this.state;
    return (
      <div>
        <h1>Signup</h1>
        <AuthForm onSubmit={this.onSubmit.bind(this)} errors={errors} />
      </div>
    );
  }
}

export default graphql(CurrentUserQuery)(graphql(SignupMutation)(SignupForm));
