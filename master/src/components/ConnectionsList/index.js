import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { connectionType } from '../../types';
import './ConnectionsList.sass';

const propTypes = {
  connections: PropTypes.arrayOf(
    PropTypes.shape(connectionType),
  ).isRequired,
};

const ConnectionsList = ({ connections }) => {
  const dataColumns = ['Ip Adress', 'ID', 'Delta Time', 'Join Time'];

  const tableHeaders = (
    <thead>
      <tr>
        {dataColumns.map(column => (
          <th key={column}>{column}</th>
        ))}
      </tr>
    </thead>
  );

  const tableBody = (
    <tbody>
      {connections.map(connection => (
        <tr key={connection.id}>
          <td key={connection.ip}>
            {(connection.ip).replace('::ffff:', '')}
          </td>
          <td key={connection.id}>
            {connection.id}
          </td>
          <td key={connection.deltaTime}>
            {(connection.deltaTime / 1000).toFixed(2)}
          </td>
          <td key={connection.joinTime}>
            <time dateTime={new Date(connection.joinTime).toISOString()}>
              {new Date(connection.joinTime).toLocaleTimeString()}
            </time>
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="ConnectionsList">
      <table width="100%">
        {tableHeaders}
        {tableBody}
      </table>
    </div>
  );
};

ConnectionsList.propTypes = propTypes;

const mapStateToProps = ({ connections }) => ({
  connections,
});

export default connect(mapStateToProps)(ConnectionsList);
