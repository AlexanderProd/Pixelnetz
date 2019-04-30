import {
  ClientMatrix,
  prepareMatrix,
  PixelGrid,
} from './rasterization';
import { roundFloat, toHex } from '../util/numbers';
import { MAX_FRAMES } from './rasterisationConstants';

export interface PartRasterizationInput {
  frames: PixelGrid[];
  minDelay: number;
  offsetIndex: number;
  width: number;
  height: number;
  channels: number;
  maxFrames?: number;
}

async function rasterizePart({
  frames,
  minDelay,
  offsetIndex,
  width,
  height,
  channels,
  maxFrames = MAX_FRAMES,
}: PartRasterizationInput): Promise<ClientMatrix> {
  const matrix: ClientMatrix = prepareMatrix(
    width,
    height,
    frames.length,
  );

  frames.forEach(({ delay, index, data, shape }) => {
    const delayFactor = roundFloat(delay / minDelay, 2);
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
      const col = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

      const i = pos / channels;
      const x = i % width;
      const y = Math.floor(i / width);

      const gridCoord = width * y + x;
      const frameIndex = index - offsetIndex * maxFrames;

      matrix[gridCoord][frameIndex] = [col, delayFactor];
    }
  });

  return matrix;
}

export default rasterizePart;
