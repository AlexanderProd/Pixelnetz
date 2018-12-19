/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { connectionType, dimensionsType, sequenceType } from '../../types';
import createAnimationController from '../../../../shared/dist/animationController';
import { Button } from '../ui';
import './Preview.sass';

const createCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.classList.add('preview-canvas');
  return canvas;
};

const getWidth = elem => Number(window
  .getComputedStyle(elem)
  .getPropertyValue('width')
  .split('px')[0]);

const setHeight = (elem, val) => elem
  .style
  .setProperty('height', `${val}px`);

const createFrameHandler = (canvas, dimensions) => {
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#434343';

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const blockScaling = canvas.width / dimensions.width;
  // eslint-disable-next-line no-param-reassign
  canvas.height = blockScaling * dimensions.height;

  return (frame) => {
    for (let y = 0; y < dimensions.height; y++) {
      for (let x = 0; x < dimensions.width; x++) {
        const col = frame[(dimensions.width * y) + x];
        ctx.fillStyle = col;
        ctx.fillRect(
          x * blockScaling,
          y * blockScaling,
          blockScaling,
          blockScaling,
        );
        ctx.strokeRect(
          x * blockScaling,
          y * blockScaling,
          blockScaling,
          blockScaling,
        );
      }
    }
  };
};

const propTypes = {
  connections: PropTypes.arrayOf(
    PropTypes.shape(connectionType),
  ).isRequired,
  dimensions: PropTypes.shape(dimensionsType).isRequired,
  masterSequence: PropTypes.shape(sequenceType),
};

const defaultProps = {
  masterSequence: null,
};

const Preview = ({ connections, dimensions, masterSequence }) => {
  const [canvas] = useState(
    createCanvas(),
  );

  const [animationController, setAnimationController] = useState(null);

  useEffect(() => {
    const wrapper = document.getElementById('Preview');
    if (wrapper) {
      wrapper.appendChild(canvas);
    }
  }, []);

  useEffect(() => {
    const { width, height } = dimensions;
    const cWidth = getWidth(canvas);
    const blockScaling = cWidth / width;
    setHeight(canvas, blockScaling * height);
    const controller = createAnimationController(createFrameHandler(
      canvas,
      dimensions,
    ));
    controller.setSequence(masterSequence);
    setAnimationController(controller);
  }, [dimensions, masterSequence]);

  const handleStart = () => {
    animationController.start(Date.now());
  };

  const handleStop = () => {
    animationController.stop();
  };

  return (
    <>
      <div id="Preview" className="Preview" />
      <Button primary onClick={handleStart}>Start</Button>
      <Button secondary onClick={handleStop}>Stop</Button>
    </>
  );
};

Preview.propTypes = propTypes;
Preview.defaultProps = defaultProps;

const mapStateToProps = ({
  connections,
  dimensions,
  masterSequence,
}) => ({
  connections,
  dimensions,
  masterSequence,
});

export default connect(mapStateToProps)(Preview);
