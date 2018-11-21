import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './ConnectionCounter.sass';

const propTypes = {
  connections: PropTypes.arrayOf(PropTypes.shape()),
};

const defaultProps = {
  connections: null,
};

export const ConnectionCounter = ({ connections }) => (
  <div className="ConnectionCounter">
    <h2 className="connection-count">{(connections || []).length}</h2>
  </div>
);

ConnectionCounter.propTypes = propTypes;
ConnectionCounter.defaultProps = defaultProps;

const mapStateToProps = ({ connections }) => ({
  connections,
});

export default connect(mapStateToProps)(ConnectionCounter);
