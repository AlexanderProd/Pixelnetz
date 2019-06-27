import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleSound, deleteSound } from '../../redux/sounds';
import Sound from './Sound';
import { soundType } from '../../types';
import './SoundSelector.sass';

const propTypes = {
  toggleSound: PropTypes.func.isRequired,
  deleteSound: PropTypes.func.isRequired,
  sounds: PropTypes.arrayOf(PropTypes.shape(soundType)).isRequired,
};

const SoundSelector = ({
  sounds,
  toggleSound, // eslint-disable-line no-shadow
  deleteSound, // eslint-disable-line no-shadow
}) => (
  <div className="SoundSelector">
    {sounds.sort().map(sound => (
      <Sound
        key={sound.fileName}
        sound={sound}
        onToggle={toggleSound}
        onDelete={deleteSound}
      />
    ))}
  </div>
);

SoundSelector.propTypes = propTypes;

const mapStateToProps = ({ sounds }) => ({
  sounds,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleSound,
      deleteSound,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SoundSelector);
