import {
  ClientMatrix,
  prepareMatrix,
  PixelGrid,
} from './rasterization';
import {
  encodeColor,
  toRGBColor,
} from '../../../shared/src/util/colors';

export interface PartRasterizationInput {
  frames: PixelGrid[];
  width: number;
  height: number;
  channels: number;
}

async function rasterizePart({
  frames,
  width,
  height,
  channels,
}: PartRasterizationInput): Promise<ClientMatrix> {
  const matrix: ClientMatrix = prepareMatrix(width, height);

  for (const { data, shape } of frames) {
    const [imageWidth, imageHeight, colorChannels] = shape;
    if (
      imageWidth !== width ||
      imageHeight !== height ||
      colorChannels !== channels
    ) {
      throw new Error(
        'Image dimensions do not match frame dimensions',
      );
    }

    for (let pos = 0; pos < data.length; pos += channels) {
      const r = data[pos];
      const g = data[pos + 1];
      const b = data[pos + 2];
      const rgbColor = toRGBColor(r, g, b);
      const color = encodeColor(rgbColor);

      const i = pos / channels;
      const x = i % width;
      const y = Math.floor(i / width);

      const gridCoord = width * y + x;
      const stack = matrix[gridCoord];
      const prev = stack[stack.length - 1];

      if (prev && prev[0] === color) {
        prev[1] += 1;
      } else {
        stack.push([color, 1]);
      }
    }
  }

  return matrix;
}

export default rasterizePart;
