import React, { Component } from 'react';
import * as React from 'react';

class AuthForm extends Component {
  constructor(props) {
    super(props);

    this.state = { email: '', password: '' };
  }

  onSubmit(event) {
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
