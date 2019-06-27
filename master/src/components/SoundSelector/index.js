import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSound, deleteSound } from '../../redux/sounds';
import Sound from './Sound';
import { sequenceType } from '../../types';
import './SoundSelector.sass';

const propTypes = {
  setSound: PropTypes.func.isRequired,
  deleteSound: PropTypes.func.isRequired,
  sounds: PropTypes.arrayOf(PropTypes.shape(sequenceType)).isRequired,
};

const SoundSelector = ({
  sounds,
  setSound, // eslint-disable-line no-shadow
  deleteSound, // eslint-disable-line no-shadow
}) => (
  <div className="SoundSelector">
    {sounds
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .map(sound => (
        <Sound
          key={sound.name}
          sound={sound}
          onSet={setSound}
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
      setSound,
      deleteSound,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SoundSelector);
