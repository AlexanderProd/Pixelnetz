import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { increment, decrement } from '../../redux/counter';

const propTypes = {
  count: PropTypes.number.isRequired,
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
};

// eslint-disable-next-line no-shadow
const Counter = ({ count, increment, decrement }) => (
  <div>
    <button type="button" onClick={decrement}>-</button>
    <span>{count}</span>
    <button type="button" onClick={increment}>+</button>
  </div>
);

Counter.propTypes = propTypes;

const mapStateToProps = ({ counter }) => ({
  count: counter.count,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  increment,
  decrement,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
