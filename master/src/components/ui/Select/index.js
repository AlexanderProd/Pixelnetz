import React from 'react';
import {
  string,
  arrayOf,
  shape,
  oneOfType,
  node,
  func,
} from 'prop-types';

const propTypes = {
  className: string,
  options: arrayOf(
    shape({
      value: string.isRequired,
      child: oneOfType([string, node]).isRequired,
    }),
  ),
  value: shape({
    value: string.isRequired,
    child: oneOfType([string, node]).isRequired,
  }),
  onChange: func,
};

const defaultProps = {
  className: '',
  options: [],
  value: null,
  onChange: null,
};

const Select = ({
  options,
  className,
  value,
  onChange,
  ...props
}) => {
  const handleChange = e => {
    if (typeof onChange === 'function') {
      onChange(
        options.find(option => option.value === e.target.value),
      );
    }
  };
  return (
    <select
      className={`Select ${className}`}
      onChange={handleChange}
      value={value.value}
      {...props}
    >
      {options.map(option => (
        <option
          key={option.value}
          value={option.value}
          {...option.props}
        >
          {option.child}
        </option>
      ))}
    </select>
  );
};

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default Select;
