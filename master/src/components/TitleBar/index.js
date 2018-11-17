import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout as logoutUser } from '../../redux/auth';
import { Icon, Button } from '../ui';
import { authType } from '../../types';
import './TitleBar.sass';

const propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.shape(authType),
};

const defaultProps = {
  auth: null,
};

const TitleBar = ({ auth, logout }) => (
  <div className="TitleBar">
    <div className="title-bar-left">
      <h1 className="title-header">Pixelnetz Master</h1>
      <a
        className="dashboard-link"
        href="http://3.120.26.9:2800"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="dashboard" />
        <span>Dashboard</span>
      </a>
    </div>
    <div className="title-bar-right">
      <Button icon="menu" basic className="title-menu-button" />
      {auth && (
        <Button basic onClick={logout}>Logout</Button>
      )}
    </div>
  </div>
);

TitleBar.propTypes = propTypes;
TitleBar.defaultProps = defaultProps;

const mapStateToProps = ({ auth }) => ({
  auth,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  logout: logoutUser,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TitleBar);
