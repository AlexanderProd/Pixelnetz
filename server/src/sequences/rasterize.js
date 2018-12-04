import { promisify } from 'util';
import chroma from 'chroma-js';
import getPixelsCB from 'get-pixels';
import sharp from 'sharp';
import toMatrix from './toMatrix';

const getPixels = promisify(getPixelsCB);

const toHex = num => num.toString(16).padStart(2, '0');

const rasterize = (buffer, mimetype) => sharp(buffer)
  .resize(10)
  .toBuffer()
  .then(b => getPixels(b, mimetype))
  .then(({ data, shape }) => {
    const [width, height, channels] = shape;

    const matrix = [];
    for (let pos = 0; pos < (data.length / channels); pos += channels) {
      const r = data[pos];
      const g = data[pos + 1];
      const b = data[pos + 2];
      const col = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

      const i = pos / channels;
      const isRowStart = i % width === 0;
      const rowIndex = Math.floor(i / width);
      if (isRowStart) {
        matrix.push([[[col, 1]]]);
      } else {
        matrix[rowIndex].push([[col, 1]]);
      }
    }

    console.log(matrix);

    const colorStrip = toMatrix(data, channels)
      .map(([r, g, b]) => chroma(r, g, b).hex());
    return toMatrix(colorStrip, width);
  })
  .then(pixelMatrix => pixelMatrix.map(
    row => row.map(col => [[col, 1]]),
  ));

export default rasterize;
