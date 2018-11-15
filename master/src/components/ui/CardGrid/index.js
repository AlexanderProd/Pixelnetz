import React from 'react';
import PropTypes from 'prop-types';
import './CardGrid.sass';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

const CardGrid = ({ children }) => (
  <div className="CardGrid">
    {children}
  </div>
);

CardGrid.propTypes = propTypes;
CardGrid.defaultProps = defaultProps;

export default CardGrid;
