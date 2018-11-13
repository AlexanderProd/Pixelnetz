import { promisify } from 'util';
import chroma from 'chroma-js';
import getPixelsCB from 'get-pixels';
import sharp from 'sharp';
import toMatrix from './toMatrix';

const getPixels = promisify(getPixelsCB);

const rasterize = buffer => sharp(buffer)
  .resize(10)
  .toBuffer()
  .then(b => getPixels(b, 'image/png'))
  .then(({ data, shape }) => {
    const [width,, channels] = shape;
    const colorStrip = toMatrix(data, channels)
      .map(([r, g, b]) => chroma(r, g, b).hex());
    return toMatrix(colorStrip, width);
  });

export default rasterize;
