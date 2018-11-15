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
  className: PropTypes.string,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  neutral: PropTypes.bool,
};

const defaultProps = {
  type: 'button',
  children: null,
  icon: null,
  className: '',
  primary: false,
  secondary: false,
  neutral: false,
};

const Button = ({
  children,
  type,
  icon,
  className,
  primary,
  secondary,
  neutral,
  ...props
}) => {
  const iconClass = icon ? 'icon ' : '';
  const primaryClass = primary ? 'primary' : '';
  const secondaryClass = secondary ? 'secondary' : '';
  const neutralClass = neutral ? 'neutral' : '';
  return (
    // eslint-disable-next-line react/button-has-type
    <button
      className={
        'Button ' +
        `${className} ` +
        `${iconClass} ` +
        `${primaryClass} ` +
        `${secondaryClass} ` +
        `${neutralClass}`
      }
      type={type}
      {...props}
    >
      {icon ? <Icon name={icon} /> : children}
    </button>
  );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
