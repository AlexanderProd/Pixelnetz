import getFrames from './getFrames';
import Mimetypes from './mimetypes';
import {
  splitToSize,
  PixelGrid,
  ClientMatrix,
} from './rasterization';
import { mapFramesToPixelGrid } from './getPixelsFromFrame';
import rasterizePart, {
  PartRasterizationInput,
} from './rasterizePart';
import { MAX_FRAMES } from './rasterisationConstants';
import { createColorEncoding } from '../../../shared/src/util/colors';

export interface RasterizationData {
  getMatrixPart: () => AsyncIterableIterator<{
    matrix: ClientMatrix;
    index: number;
  }>;
  stepLength: number;
  width: number;
  height: number;
  length: number;
  duration: number;
  numChunks: number;
  maxChunkSize: number;
}

export const createGetMatrixPart = ({
  frameParts,
  width,
  height,
  channels,
  bitDepth,
}: {
  frameParts: PixelGrid[][];
  width: number;
  height: number;
  channels: number;
  bitDepth: number;
}) =>
  async function* getMatrixPart() {
    const { encode: encodeColor } = createColorEncoding(bitDepth);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < frameParts.length; i++) {
      const part = frameParts[i];
      const input: PartRasterizationInput = {
        frames: part,
        width,
        height,
        channels,
        encodeColor,
      };
      yield {
        // eslint-disable-next-line no-await-in-loop
        matrix: await rasterizePart(input),
        index: i,
      };
    }
  };

const rasterize = async (
  buffer: Buffer,
  mimetype: Mimetypes,
  bitDepth: number,
  maxFrames: number = MAX_FRAMES,
): Promise<RasterizationData> => {
  const frames = await getFrames(buffer, mimetype);

  const frameDelays = frames.map(({ delay }): number => delay);

  const minDelay = frameDelays.reduce(
    (acc, delay): number => (delay < acc ? delay : acc),
    Infinity,
  );

  const duration = frameDelays.reduce(
    (acc, delay): number => acc + delay,
    0,
  );

  const pixel: PixelGrid[] = await mapFramesToPixelGrid(
    frames,
    mimetype,
  );

  const [width, height, channels] = pixel[0].shape;

  const frameParts = splitToSize(pixel, maxFrames);

  return {
    stepLength: minDelay,
    width,
    height,
    length: pixel.length,
    duration,
    getMatrixPart: createGetMatrixPart({
      frameParts,
      width,
      height,
      channels,
      bitDepth,
    }),
    numChunks: frameParts.length,
    maxChunkSize: maxFrames,
  };
};

export default rasterize;
