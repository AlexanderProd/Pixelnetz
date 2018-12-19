import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Toggle, Input, Icon } from '../ui';
import { sequenceType } from '../../types';

const propTypes = {
  onSet: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  sequence: PropTypes.shape(sequenceType).isRequired,
};

const Sequence = ({ sequence, onSet, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [repeat, setRepeat] = useState(sequence.repeat);
  const [stepLength, setStepLength] = useState(sequence.stepLength);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  const handleStepLenghtChange = (e) => {
    setStepLength(e.target.value);
  };

  return (
    <div className="Sequence">
      <div className="sequence-controlls">
        <div
          className="sequence-group dropdown"
          onClick={toggleExpand}
          role="button"
          tabIndex={0}
        >
          <Icon
            className={expanded ? 'sequence-expanded' : ''}
            name="arrow-drop-down"
          />
          <span className="sequence-label">{sequence.name}</span>
        </div>
        <div className="sequence-group">
          <Button
            primary
            className="animation-set-button"
            onClick={() => onSet({
              ...sequence,
              repeat,
              stepLength,
            })}
          >
            Set
          </Button>
          <Button
            secondary
            className="animation-set-button"
            onClick={() => onDelete(sequence)}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className={`sequence-details ${expanded ? 'expanded' : ''}`}>
        <div className="s-d-row">
          <span className="s-d-title">repeat:</span>
          <span className="s-d-val">
            <Toggle
              value={repeat}
              onChange={toggleRepeat}
            />
          </span>
        </div>
        <div className="s-d-row">
          <span className="s-d-title">stepLength:</span>
          <span className="s-d-val">
            <Input
              className="step-length-input"
              type="number"
              value={stepLength}
              onChange={handleStepLenghtChange}
            />
          </span>
        </div>
        <div className="s-d-row">
          <span className="s-d-title">duration:</span>
          <span className="s-d-val">{sequence.duration}</span>
        </div>
        <div className="s-d-row">
          <span className="s-d-title">length:</span>
          <span className="s-d-val">{sequence.length}</span>
        </div>
        <div className="s-d-row">
          <span className="s-d-title">width:</span>
          <span className="s-d-val">{sequence.width}</span>
        </div>
        <div className="s-d-row">
          <span className="s-d-title">height:</span>
          <span className="s-d-val">{sequence.height}</span>
        </div>
      </div>
    </div>
  );
};

Sequence.propTypes = propTypes;

export default Sequence;
