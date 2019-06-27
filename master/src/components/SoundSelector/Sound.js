import React from 'react';
import PropTypes from 'prop-types';
import { Button, Toggle } from '../ui';
import { soundType } from '../../types';

const propTypes = {
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  sound: PropTypes.shape(soundType).isRequired,
};

const Sound = ({ sound, onToggle, onDelete }) => (
  <div className="Sound">
    <div className="sound-controlls">
      <div
        className="sound-group dropdown"
        role="button"
        tabIndex={0}
      >
        <span className="sound-label">{sound.name}</span>
      </div>
      <div className="sound-group">
        <Toggle
          title="Toggle selection"
          value={sound.isSelected}
          onChange={() => onToggle(sound)}
        />
        <Button
          secondary
          className="animation-set-button"
          onClick={() => onDelete(sound)}
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
);

Sound.propTypes = propTypes;

export default Sound;
