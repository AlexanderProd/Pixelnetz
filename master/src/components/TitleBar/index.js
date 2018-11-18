import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout as logoutUser } from '../../redux/auth';
import { Button } from '../ui';
import { authType } from '../../types';
import DashboardLink from './DashboardLink';
import LogoutButton from './LogoutButton';
import './TitleBar.sass';

const propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.shape(authType),
};

const defaultProps = {
  auth: null,
};

export const TitleBar = ({ auth, logout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="TitleBar">
      <div className="title-bar-left">
        <h1 className="title-header">Pixelnetz Master</h1>
        <DashboardLink className="in-title-bar" />
      </div>
      <div className="title-bar-right">
        <Button
          className="title-menu-button"
          icon="menu"
          onClick={handleMenuToggle}
          basic
        />
        {auth && (
          <LogoutButton className="in-title-bar" logout={logout} />
        )}
      </div>
      <div className={`title-menu ${!menuOpen ? 'menu-closed' : ''}`}>
        <div className="title-menu-item">
          <DashboardLink className="in-menu" />
        </div>
        {auth && (
          <div className="title-menu-item">
            <LogoutButton className="in-menu" logout={logout} />
          </div>
        )}
      </div>
    </div>
  );
};

TitleBar.propTypes = propTypes;
TitleBar.defaultProps = defaultProps;

const mapStateToProps = ({ auth }) => ({
  auth,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  logout: logoutUser,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TitleBar);
