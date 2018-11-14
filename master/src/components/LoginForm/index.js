import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authenticate } from '../../redux/auth';
import { Form } from '../ui';

const propTypes = {
  authenticate: PropTypes.func.isRequired,
};

export const LoginForm = (props) => {
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    const { value } = e.target;
    setPassword(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.authenticate(password);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleChange}
      />
      <button type="submit">Login</button>
    </Form>
  );
};

LoginForm.propTypes = propTypes;

const mapDispatchToProps = dispatch => bindActionCreators({
  authenticate,
}, dispatch);

export default connect(null, mapDispatchToProps)(LoginForm);
