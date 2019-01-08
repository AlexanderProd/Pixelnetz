import React from 'react';
import PropTypes from 'prop-types';
import codepoints from './codepoints';
import './Icon.sass';

const propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

const Icon = ({ name, className }) => (
  <i className={`Icon ${className}`}>{codepoints[name]}</i>
);

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;

export default Icon;
