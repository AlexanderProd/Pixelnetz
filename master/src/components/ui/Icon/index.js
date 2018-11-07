import React from 'react';
import PropTypes from 'prop-types';
import codepoints from './codepoints';
import './Icon.sass';

const propTypes = {
  name: PropTypes.string.isRequired,
};

const Icon = ({ name }) => (
  <i className="Icon">{codepoints[name]}</i>
);

Icon.propTypes = propTypes;

export default Icon;
