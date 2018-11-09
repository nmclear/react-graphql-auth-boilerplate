import React, { Component } from 'react';

class SignupForm extends Component {
  constructor(props) {
    super(props);

    this.state = { errors: [] };
  }

  render() {
    const { errors } = this.state;
    return (
      <div>
        <h1>Signup Form</h1>
      </div>
    );
  }
}

export default SignupForm;
