import { promisify } from 'util';
import getPixelsCB from 'get-pixels';
import sharp from 'sharp';

const getPixels = promisify(getPixelsCB);

const toHex = num => num.toString(16).padStart(2, '0');

const rasterize = (buffer, mimetype) => sharp(buffer)
  .resize(480)
  .toBuffer()
  .then(b => getPixels(b, mimetype))
  .then(({ data, shape }) => {
    const [width,, channels] = shape;

    const matrix = [];
    for (let pos = 0; pos < data.length; pos += channels) {
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

    return matrix;
  });

export default rasterize;
