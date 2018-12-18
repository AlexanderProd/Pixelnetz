import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { connectionType, dimensionsType } from '../../types';
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

const propTypes = {
  connections: PropTypes.arrayOf(
    PropTypes.shape(connectionType),
  ).isRequired,
  dimensions: PropTypes.shape(dimensionsType).isRequired,
};

const Preview = ({ connections, dimensions }) => {
  const [canvas] = useState(
    createCanvas(),
  );

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
  }, [dimensions]);

  return (
    <div id="Preview" className="Preview" />
  );
};

Preview.propTypes = propTypes;

const mapStateToProps = ({ connections, dimensions }) => ({
  connections,
  dimensions,
});

export default connect(mapStateToProps)(Preview);
