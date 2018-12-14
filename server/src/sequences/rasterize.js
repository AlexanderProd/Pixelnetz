import { promisify } from 'util';
import getPixelsCB from 'get-pixels';
import sharp from 'sharp';
import getFrames from './getFrames';
import mimetypes from '../../dist/sequences/mimetypes';

const getPixels = promisify(getPixelsCB);

const toHex = num => num.toString(16).padStart(2, '0');

const getSharpMimetype = (type) => {
  switch (type) {
    case mimetypes.GIF:
      return mimetypes.PNG;
    default:
      return type;
  }
};

const rasterize = (buffer, mimetype) => {
  const matrix = [];
  const frames = getFrames(buffer, mimetype);
  frames.forEach(async frame => await sharp(frame)
    .resize(480)
    .toBuffer()
    .then(b => getPixels(b, getSharpMimetype(mimetype)))
    .then(({ data, shape }) => {
      const [width, height, channels] = shape;

      if (matrix.length === 0) {
        for (let y = 0; y < height; y++) {
          matrix.push([]);
          for (let x = 0; x < width; x++) {
            matrix[y].push([]);
          }
        }
      }

      for (let pos = 0; pos < data.length; pos += channels) {
        const r = data[pos];
        const g = data[pos + 1];
        const b = data[pos + 2];
        const col = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

        const i = pos / channels;
        const x = i % width;
        const y = Math.floor(i / width);

        matrix[y][x].push([col, 1]);
      }
    }));

  return matrix;
};

export default rasterize;
