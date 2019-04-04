import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeError } from '../../redux/error';
import { Icon } from '../ui';
import './ErrorMenu.sass';

const propTypes = {
  removeError: PropTypes.func.isRequired,
  error: PropTypes.objectOf(PropTypes.string),
};

const defaultProps = {
  error: null,
};

// eslint-disable-next-line no-shadow
const ErrorMenu = ({ error, removeError }) => {
  if (!error) return null;

  return (
    <div className="ErrorMenu">
      {Object.entries(error).map(([key, message]) => (
        <div className="error-item" key={key}>
          <div className="error-message">{message}</div>
          <Icon name="close" onClick={() => removeError(key)} />
        </div>
      ))}
    </div>
  );
};

ErrorMenu.propTypes = propTypes;
ErrorMenu.defaultProps = defaultProps;

const mapStateToProps = ({ error }) => ({
  error,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    removeError,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ErrorMenu);
