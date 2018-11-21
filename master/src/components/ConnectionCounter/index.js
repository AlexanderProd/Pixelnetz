import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { connectionType } from '../../types';
import './ConnectionCounter.sass';

const propTypes = {
  connections: PropTypes.arrayOf(
    PropTypes.shape(connectionType),
  ).isRequired,
};

export const ConnectionCounter = ({ connections }) => (
  <div className="ConnectionCounter">
    <h2 className="connection-count">{connections.length}</h2>
  </div>
);

ConnectionCounter.propTypes = propTypes;

const mapStateToProps = ({ connections }) => ({
  connections,
});

export default connect(mapStateToProps)(ConnectionCounter);
