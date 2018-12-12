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
  const dataColumns = ['IP Adress', 'ID', 'Longitude', 'Latitude', 'Delta Time', 'Join Time'];

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
      {connections.reverse().map(connection => (
        <tr key={connection.id}>
          <td>
            {(connection.ip).replace('::ffff:', '')}
          </td>
          <td>
            {connection.id}
          </td>
          <td>
            {connection.properties ? connection.properties.x : '' }
          </td>
          <td>
            {connection.properties ? connection.properties.y : ''}
          </td>
          <td>
            {(connection.deltaTime / 1000).toFixed(2)}
          </td>
          <td>
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
      <table>
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
