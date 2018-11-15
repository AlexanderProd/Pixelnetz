import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
  onSubmit: PropTypes.func,
  className: PropTypes.string,
};

const defaultProps = {
  children: null,
  onSubmit: () => null,
  className: '',
};

const Form = ({ children, onSubmit, className }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form className={`Form ${className}`} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

Form.propTypes = propTypes;
Form.defaultProps = defaultProps;

export default Form;
