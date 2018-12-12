import React from 'react';
import PropTypes from 'prop-types';
import './Card.sass';

const propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  spanCols: PropTypes.number,
  spanRows: PropTypes.number,
};

const defaultProps = {
  children: null,
  title: '',
  spanCols: null,
  spanRows: null,
};

const Card = ({ children, title, spanCols, spanRows }) => {
  const colsName = spanCols ? `card-cols-${spanCols}` : '';
  const rowsName = spanRows ? `card-rows-${spanRows}` : '';
  return (
    <div className={`Card ${colsName} ${rowsName}`}>
      <div className="card-title">{title}</div>
      <div className="card-body">{children}</div>
    </div>
  );
};

Card.propTypes = propTypes;
Card.defaultProps = defaultProps;

export default Card;
