import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { startAnimation as start, stopAnimation as stop } from '../../redux/animationControl';
import { Button } from '../ui';

const propTypes = {
  startAnimation: PropTypes.func.isRequired,
  stopAnimation: PropTypes.func.isRequired,
  startError: PropTypes.bool.isRequired,
  stopError: PropTypes.bool.isRequired,
};

export const AnimationControls = ({ startAnimation, stopAnimation }) => (
  <div className="AnimationControls">
    <Button className="animation-start-button" icon="play-arrow" onClick={startAnimation} />
    <Button className="animation-stop-button" icon="pause" onClick={stopAnimation} />
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
