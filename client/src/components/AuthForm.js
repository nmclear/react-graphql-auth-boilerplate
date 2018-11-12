// @flow

import React, { Component } from 'react';
// import * as React from 'react';

type Props = {
  errors: Array<string>,
  onSubmit: Function
};

type State = {
  email: string,
  password: string
};

class AuthForm extends Component<Props, State> {
  constructor(props: Object) {
    super(props);

    this.state = { email: '', password: '' };
  }

  onSubmit(event: SyntheticEvent<HTMLButtonElement>) {
    event.preventDefault();
    const { email, password } = this.state;
    this.props.onSubmit({ email, password });
  }

  renderErrors() {
    const { errors } = this.props;
    return errors.map(error => <div key={error}>{error}</div>);
  }

  render() {
    const { email, password } = this.state;

    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <div>
          <input
            name="auth-email"
            value={email}
            placeholder="Email"
            onChange={e => this.setState({ email: e.target.value })}
          />
        </div>
        <div>
          <input
            name="auth-password"
            value={password}
            placeholder="Password"
            type="password"
            onChange={e => this.setState({ password: e.target.value })}
          />
        </div>
        <div>{this.renderErrors()}</div>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default AuthForm;
