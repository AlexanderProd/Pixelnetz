import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../ui';

const propTypes = {
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

const DashboardLink = ({ className }) => (
  <a
    className={`dashboard-link ${className}`}
    href="http://3.121.177.95:2800"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon name="dashboard" />
    <span>Dashboard</span>
  </a>
);

DashboardLink.propTypes = propTypes;
DashboardLink.defaultProps = defaultProps;

export default DashboardLink;
