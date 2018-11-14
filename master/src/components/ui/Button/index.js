import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import './Button.sass';

const propTypes = {
  type: PropTypes.oneOf([
    'button',
    'submit',
    'reset',
  ]),
  children: PropTypes.node,
  icon: PropTypes.string,
};

const defaultProps = {
  type: 'button',
  children: null,
  icon: null,
};

const Button = ({ children, type, icon, ...props }) => (
  // eslint-disable-next-line react/button-has-type
  <button className={`Button${icon ? ' icon' : ''}`} type={type} {...props}>
    {icon ? <Icon name={icon} /> : children}
  </button>
);

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
