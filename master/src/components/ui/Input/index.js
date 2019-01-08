import React from 'react';
import PropTypes from 'prop-types';
import './Input.sass';

const propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf([
    'text',
    'password',
    'number',
  ]),
};

const defaultProps = {
  className: '',
  type: 'text',
};

const Input = ({ type, className, ...props }) => (
  <input
    className={`Input ${className}`}
    type={type}
    {...props}
  />
);

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;
