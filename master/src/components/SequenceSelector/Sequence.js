import React, { useState } from 'react';
import { func, shape, arrayOf, string } from 'prop-types';
import { Button, Toggle, Input, Icon, Select } from '../ui';
import { sequenceType } from '../../types';

const propTypes = {
  onSet: func.isRequired,
  onDelete: func.isRequired,
  sequence: shape(sequenceType).isRequired,
  soundOptions: arrayOf(
    shape({
      value: string.isRequired,
      child: string.isRequired,
    }),
  ).isRequired,
};

const Sequence = ({ sequence, onSet, onDelete, soundOptions }) => {
  const [expanded, setExpanded] = useState(false);
  const [repeat, setRepeat] = useState(sequence.repeat);
  const [stepLength, setStepLength] = useState(sequence.stepLength);
  const [isTest, setIsTest] = useState(false);
  const [testWidth, setTestWidth] = useState(50);
  const [testHeight, setTestHeight] = useState(30);
  const [sound, setSound] = useState(soundOptions[0]);
  const [soundCondition, setSoundCondition] = useState(
    '0.5; 0.5; 0.5',
  );

  const handleToggle = handler => () =>
    handler(prevState => !prevState);

  const handleValueChange = handler => e => handler(e.target.value);

  return (
    <div className="Sequence">
      <div className="sequence-controlls">
        <div
          className="sequence-group dropdown"
          onClick={handleToggle(setExpanded)}
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
            onClick={() =>
              onSet({
                ...sequence,
                repeat,
                stepLength,
                isTest,
                testWidth,
                testHeight,
                soundFile: sound,
                soundCondition,
              })
            }
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
      <div
        className={`sequence-details ${expanded ? 'expanded' : ''}`}
      >
        <div className="s-d-row">
          <span className="s-d-title">repeat:</span>
          <span className="s-d-val">
            <Toggle
              value={repeat}
              onChange={handleToggle(setRepeat)}
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
              onChange={handleValueChange(setStepLength)}
            />
          </span>
        </div>
        <div className="s-d-row">
          <span className="s-d-title">sound:</span>
          <span className="s-d-val">
            <Select
              options={soundOptions}
              value={sound}
              onChange={setSound}
            />
          </span>
        </div>
        <div className="s-d-row">
          <span className="s-d-title">soundCondition:</span>
          <span className="s-d-val">
            <Input
              className="sound-condition-input"
              value={soundCondition}
              onChange={handleValueChange(setSoundCondition)}
            />
          </span>
        </div>
        <div className="s-d-row">
          <span className="s-d-title">isTest:</span>
          <span className="s-d-val">
            <Toggle
              value={isTest}
              onChange={handleToggle(setIsTest)}
            />
          </span>
        </div>
        <div className="s-d-row">
          <span className="s-d-title">testWidth:</span>
          <span className="s-d-val">
            <Input
              className="step-length-input"
              type="number"
              value={testWidth}
              onChange={handleValueChange(setTestWidth)}
            />
          </span>
        </div>
        <div className="s-d-row">
          <span className="s-d-title">testHeight:</span>
          <span className="s-d-val">
            <Input
              className="step-length-input"
              type="number"
              value={testHeight}
              onChange={handleValueChange(setTestHeight)}
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
        <div className="s-d-row">
          <span className="s-d-title">bitDepth:</span>
          <span className="s-d-val">{sequence.bitDepth}</span>
        </div>
      </div>
    </div>
  );
};

Sequence.propTypes = propTypes;

export default Sequence;
