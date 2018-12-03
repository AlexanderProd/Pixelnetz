import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSequence, deleteSequence } from '../../redux/sequences';
import Sequence from './Sequence';
import './SequenceSelector.sass';

const propTypes = {
  setSequence: PropTypes.func.isRequired,
  deleteSequence: PropTypes.func.isRequired,
  sequences: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const SequenceSelector = ({
  sequences,
  setSequence, // eslint-disable-line no-shadow
  deleteSequence, // eslint-disable-line no-shadow
}) => (
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

SequenceSelector.propTypes = propTypes;

const mapStateToProps = ({ sequences }) => ({
  sequences,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setSequence,
  deleteSequence,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SequenceSelector);
