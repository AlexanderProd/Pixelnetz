import React from 'react';
import PropTypes from 'prop-types';
import './Input.sass';

const propTypes = {
  type: PropTypes.oneOf([
    'text',
    'password',
  ]),
};

const defaultProps = {
  type: 'text',
};

const Input = ({ type, ...props }) => (
  <input className="Input" type={type} {...props} />
);

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;
