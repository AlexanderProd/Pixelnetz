import React from 'react';
import PropTypes from 'prop-types';
import ReactToggle from 'react-toggle';
import 'react-toggle/style.css';
import './Toggle.sass';

const propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
};

const defaultProps = {
  value: false,
  onChange: null,
};

const handleChange = onChange => e => onChange({
  ...e,
  target: {
    ...e.target,
    value: e.target.checked,
  },
});

const Toggle = ({
  value,
  onChange,
  ...props
}) => (
  <ReactToggle
    checked={value}
    icons={false}
    onChange={handleChange(onChange)}
    {...props}
  />
);

Toggle.propTypes = propTypes;
Toggle.defaultProps = defaultProps;

export default Toggle;
