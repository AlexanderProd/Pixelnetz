import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authenticate } from '../../redux/auth';
import { Form, Button, Input } from '../ui';
import './LoginForm.sass';

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
    <Form className="LoginForm" onSubmit={handleSubmit}>
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handleChange}
      />
      <Button type="submit">Login</Button>
    </Form>
  );
};

LoginForm.propTypes = propTypes;

const mapDispatchToProps = dispatch => bindActionCreators({
  authenticate,
}, dispatch);

export default connect(null, mapDispatchToProps)(LoginForm);
