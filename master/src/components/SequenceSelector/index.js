import React from 'react';
import { func, arrayOf, shape } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSequence, deleteSequence } from '../../redux/sequences';
import Sequence from './Sequence';
import { sequenceType, soundType } from '../../types';
import './SequenceSelector.sass';

const propTypes = {
  setSequence: func.isRequired,
  deleteSequence: func.isRequired,
  sequences: arrayOf(shape(sequenceType)).isRequired,
  sounds: arrayOf(shape(soundType)).isRequired,
};

const SequenceSelector = ({
  sequences,
  sounds,
  setSequence, // eslint-disable-line no-shadow
  deleteSequence, // eslint-disable-line no-shadow
}) => {
  const options = sounds
    .filter(({ isSelected }) => isSelected)
    .map(({ name, fileName }) => ({ value: fileName, child: name }));

  const none = '##NONE##';

  const soundOptions = [
    { value: '##NONE##', child: 'None' },
    ...options,
  ];

  const handleSet = ({ soundFile, ...sequence }) =>
    setSequence({
      ...sequence,
      soundFile: soundFile.value === none ? null : soundFile.value,
    });

  return (
    <div className="SequenceSelector">
      {sequences
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .map(sequence => (
          <Sequence
            key={sequence.name}
            sequence={sequence}
            onSet={handleSet}
            onDelete={deleteSequence}
            soundOptions={soundOptions}
          />
        ))}
    </div>
  );
};

SequenceSelector.propTypes = propTypes;

const mapStateToProps = ({ sequences, sounds }) => ({
  sequences,
  sounds,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setSequence,
      deleteSequence,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SequenceSelector);
