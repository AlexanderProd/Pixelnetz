import { promisify } from 'util';
import getPixelsCB from 'get-pixels';
import sharp from 'sharp';
import getFrames from './getFrames';
import mimetypes from './mimetypes';

const RESOLUTION = 100;

const getPixels = promisify(getPixelsCB);

const toHex = num => num.toString(16).padStart(2, '0');
const roundFloat = (num, precision) => Number((num).toFixed(precision));

const getSharpMimetype = (type) => {
  switch (type) {
    case mimetypes.GIF:
      return mimetypes.PNG;
    default:
      return type;
  }
};

const prepareMatrix = (width, height) => {
  const matrix = [];
  for (let y = 0; y < height; y++) {
    matrix.push([]);
    for (let x = 0; x < width; x++) {
      matrix[y].push([]);
    }
  }

  return matrix;
};

const rasterize = async (buffer, mimetype) => {
  let matrix = [];
  let frames;

  try {
    frames = await getFrames(buffer, mimetype);
  } catch (e) {
    throw e;
  }

  const frameDelays = frames.map(({ delay }) => delay);

  const minDelay = frameDelays.reduce((acc, delay) => (
    delay < acc ? delay : acc
  ), Infinity);

  const duration = frameDelays.reduce((acc, delay) => acc + delay, 0);

  let imageWidth = null;
  let imageHeight = null;

  await Promise.all(frames.map(({
    frame,
    delay,
  }) => {
    const delayFactor = roundFloat(delay / minDelay, 2);
    return sharp(frame)
      .resize(RESOLUTION)
      .toBuffer()
      .then(b => getPixels(b, getSharpMimetype(mimetype)))
      .then(({ data, shape }) => {
        const [width, height, channels] = shape;

        if (matrix.length === 0) {
          matrix = prepareMatrix(width, height);
        }

        if (!imageWidth || !imageHeight) {
          imageWidth = width;
          imageHeight = height;
        }

        for (let pos = 0; pos < data.length; pos += channels) {
          const r = data[pos];
          const g = data[pos + 1];
          const b = data[pos + 2];
          const col = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

          const i = pos / channels;
          const x = i % width;
          const y = Math.floor(i / width);

          matrix[y][x].push([col, delayFactor]);
        }
      });
  }));

  return {
    matrix,
    stepLength: minDelay,
    width: imageWidth,
    height: imageHeight,
    length: frames.length,
    duration,
  };
};

export default rasterize;
