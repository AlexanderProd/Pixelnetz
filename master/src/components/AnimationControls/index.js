import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  startAnimation as start,
  stopAnimation as stop,
} from '../../redux/animationControl';
import { Button } from '../ui';
import './AnimationControls.sass';

const propTypes = {
  startAnimation: PropTypes.func.isRequired,
  stopAnimation: PropTypes.func.isRequired,
};

export const AnimationControls = ({
  startAnimation,
  stopAnimation,
}) => (
  <div className="AnimationControls">
    <Button primary className="animation-start-button" onClick={startAnimation}>
      Start
    </Button>
    <Button secondary className="animation-stop-button" onClick={stopAnimation}>
      Stop
    </Button>
  </div>
);

AnimationControls.propTypes = propTypes;

const mapStateToProps = ({ animationControl: { startError, stopError } }) => ({
  startError,
  stopError,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  startAnimation: start,
  stopAnimation: stop,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AnimationControls);
