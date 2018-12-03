import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setAnimation as set } from '../../redux/animationControl';
import './SequenceSelector.sass';
import { Button } from '../ui';

const sequencePropTypes = {
  name: PropTypes.string,
  setAnimation: PropTypes.func.isRequired,
};

const sequenceDefaultProps = {
  name: '',
};

const sequenceSelectorPropTypes = {
  sequenceNames: PropTypes.arrayOf(PropTypes.string),
};

const sequenceSelectorDefaultProps = {
  sequenceNames: null,
};

const Sequence = ({ name, setAnimation }) => (
  <div className="Sequence">
    <Button primary className="animation-set-button" onClick={() => setAnimation(name)}>
      Set
    </Button>
    <Button secondary className="animation-set-button">
      Delete
    </Button>
    <p>
      {name}
    </p>
  </div>
);

const SequenceSelector = ({ sequenceNames }) => {
  // const [sequenceNames, setSequenceNames] = useState(null);

  /* useEffect(() => {
    fetch('/savedFiles')
      .then(response => response.json())
      .then(data => setSequenceNames(data));
  }, []); */

  const table = Array.isArray(sequenceNames) && sequenceNames.map(name => Sequence({ name }));

  return (
    <div className="SequenceSelector">
      {table}
    </div>
  );
};

Sequence.propTypes = sequencePropTypes;
Sequence.defaultProps = sequenceDefaultProps;

SequenceSelector.propTypes = sequenceSelectorPropTypes;
SequenceSelector.defaultProps = sequenceSelectorDefaultProps;

const mapDispatchToProps = dispatch => bindActionCreators({
  setAnimation: set,
}, dispatch);

export default connect(null, mapDispatchToProps)(Sequence);
