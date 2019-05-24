/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dimensionsType, sequenceType } from '../../types';
import createAnimationController from '../../../../shared/dist/animationController';
import {
  createColorEncoder,
  DEFAULT_BIT_DEPTH,
} from '../../../../shared/dist/util/colors';
import { Button } from '../ui';
import './Preview.sass';

const createCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.classList.add('preview-canvas');
  return canvas;
};

const getWidth = elem =>
  Number(
    window
      .getComputedStyle(elem)
      .getPropertyValue('width')
      .split('px')[0],
  );

const setHeight = (elem, val) =>
  elem.style.setProperty('height', `${val}px`);

const createFrameHandler = (
  canvas,
  { width: gWidth, height: gHeight },
  { bitDepth },
) => {
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#434343';

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const blockScaling = canvas.width / gWidth;
  // eslint-disable-next-line no-param-reassign
  canvas.height = blockScaling * gHeight;

  const { decode: decodeColor } = createColorEncoder(
    bitDepth || DEFAULT_BIT_DEPTH,
  );

  return frame => {
    let i = 0;
    for (const item of frame) {
      if (typeof item === 'number') {
        i += item;
      } else {
        const x = i % gWidth;
        const y = Math.floor(i / gWidth);
        const [r, g, b] = decodeColor(item);
        const color = `rgb(${r}, ${g}, ${b})`;
        ctx.fillStyle = color;
        ctx.fillRect(
          x * blockScaling,
          y * blockScaling,
          blockScaling,
          blockScaling,
        );
        if (!window._nostroke) {
          ctx.strokeRect(
            x * blockScaling,
            y * blockScaling,
            blockScaling,
            blockScaling,
          );
        }
        i++;
      }
    }
  };
};

const propTypes = {
  animationStart: PropTypes.number,
  dimensions: PropTypes.shape(dimensionsType).isRequired,
  masterSequence: PropTypes.shape(sequenceType),
  appendedSequence: PropTypes.shape(sequenceType),
};

const defaultProps = {
  animationStart: null,
  masterSequence: null,
  appendedSequence: null,
};

const Preview = ({
  animationStart,
  dimensions,
  masterSequence,
  appendedSequence,
}) => {
  const [canvas] = useState(createCanvas());
  const [animationController, setAnimationController] = useState(
    null,
  );

  useEffect(() => {
    const wrapper = document.getElementById('Preview');
    if (wrapper) {
      wrapper.appendChild(canvas);
    }
  }, []);

  useEffect(() => {
    if (masterSequence) {
      if (animationController) {
        animationController.stop();
      }
      const { width, height } = dimensions;
      const cWidth = getWidth(canvas);
      const blockScaling = cWidth / width;
      setHeight(canvas, blockScaling * height);
      const controller = createAnimationController(
        createFrameHandler(canvas, dimensions, masterSequence),
      );
      controller.setSequence(masterSequence);
      setAnimationController(controller);
    }
  }, [dimensions, masterSequence]);

  useEffect(() => {
    if (appendedSequence && animationController) {
      animationController.appendSequence(appendedSequence);
    }
  }, [appendedSequence]);

  useEffect(() => {
    if (animationController) {
      if (animationStart) {
        animationController.start(animationStart);
      } else {
        animationController.stop();
      }
    }
  }, [animationStart]);

  const handleStart = () => {
    animationController.start(Date.now());
  };

  const handleStop = () => {
    animationController.stop();
  };

  return (
    <>
      <div id="Preview" className="Preview" />
      <Button primary onClick={handleStart}>
        Start
      </Button>
      <Button secondary onClick={handleStop}>
        Stop
      </Button>
    </>
  );
};

Preview.propTypes = propTypes;
Preview.defaultProps = defaultProps;

const mapStateToProps = ({
  animationStart,
  dimensions,
  masterSequence,
}) => ({
  animationStart,
  dimensions,
  masterSequence: masterSequence && masterSequence.initial,
  appendedSequence: masterSequence && masterSequence.append,
});

export default connect(mapStateToProps)(Preview);
