import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui';

const propTypes = {
  logout: PropTypes.func.isRequired,
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

const LogoutButton = ({ logout, className }) => (
  <Button
    className={`LogoutButton ${className}`}
    onClick={logout}
    basic
  >
    Logout
  </Button>
);

LogoutButton.propTypes = propTypes;
LogoutButton.defaultProps = defaultProps;

export default LogoutButton;
