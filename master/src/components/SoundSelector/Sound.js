/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui';
import { sequenceType } from '../../types';

const propTypes = {
  onSet: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  sound: PropTypes.shape(sequenceType).isRequired,
};

const Sound = ({ sound, onSet, onDelete }) => {
  return (
    <div className="Sound">
      <div className="sound-controlls">
        <div
          className="sound-group dropdown"
          role="button"
          tabIndex={0}
        >
          <span className="sound-label">{sound}</span>
        </div>
        <div className="sound-group">
          <Button
            primary
            className="animation-set-button"
            onClick={() =>
              onSet({
                ...sound,
              })
            }
          >

            Set
          </Button>
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
};

Sound.propTypes = propTypes;

export default Sound;
