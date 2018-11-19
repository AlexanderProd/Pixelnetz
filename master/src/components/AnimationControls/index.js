import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  startAnimation as start,
  stopAnimation as stop,
  setAnimation as set,
} from '../../redux/animationControl';
import { Button } from '../ui';
import './AnimationControls.sass';

const propTypes = {
  startAnimation: PropTypes.func.isRequired,
  stopAnimation: PropTypes.func.isRequired,
  setAnimation: PropTypes.func.isRequired,
  startError: PropTypes.bool.isRequired,
  stopError: PropTypes.bool.isRequired,
};

export const AnimationControls = ({
  startAnimation,
  stopAnimation,
  setAnimation,
}) => (
  <div className="AnimationControls">
    <Button primary className="animation-set-button" onClick={setAnimation}>
      Set
    </Button>
    <br />
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
  setAnimation: set,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AnimationControls);
