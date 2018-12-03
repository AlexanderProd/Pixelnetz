import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSequence, getSequences, deleteSequence } from '../../redux/sequences';
import Sequence from './Sequence';
import './SequenceSelector.sass';

const propTypes = {
  setSequence: PropTypes.func.isRequired,
  getSequences: PropTypes.func.isRequired,
  deleteSequence: PropTypes.func.isRequired,
  sequences: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const SequenceSelector = ({
  sequences,
  setSequence, // eslint-disable-line no-shadow
  getSequences, // eslint-disable-line no-shadow
  deleteSequence, // eslint-disable-line no-shadow
}) => {
  useEffect(() => getSequences(), []);

  return (
    <div className="SequenceSelector">
      {sequences.sort().map(name => (
        <Sequence
          key={name}
          name={name}
          onSet={setSequence}
          onDelete={deleteSequence}
        />
      ))}
    </div>
  );
};

SequenceSelector.propTypes = propTypes;

const mapStateToProps = ({ sequences }) => ({
  sequences,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setSequence,
  getSequences,
  deleteSequence,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SequenceSelector);
