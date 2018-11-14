import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
  onSubmit: PropTypes.func,
};

const defaultProps = {
  children: null,
  onSubmit: () => null,
};

const Form = ({ children, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

Form.propTypes = propTypes;
Form.defaultProps = defaultProps;

export default Form;
