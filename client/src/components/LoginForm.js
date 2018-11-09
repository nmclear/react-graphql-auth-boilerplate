import React, { Component } from 'react';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = { errors: [] };
  }

  render() {
    const { errors } = this.state;
    return (
      <div>
        <h1>Login Form</h1>
      </div>
    );
  }
}

export default LoginForm;
