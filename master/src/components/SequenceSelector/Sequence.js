import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui';

const propTypes = {
  onSet: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

const Sequence = ({ name, onSet, onDelete }) => (
  <div className="Sequence">
    <span className="sequence-label">{name}</span>
    <div className="sequence-button-group">
      <Button primary className="animation-set-button" onClick={() => onSet(name)}>
        Set
      </Button>
      <Button secondary className="animation-set-button" onClick={() => onDelete(name)}>
        Delete
      </Button>
    </div>
  </div>
);

Sequence.propTypes = propTypes;

export default Sequence;
