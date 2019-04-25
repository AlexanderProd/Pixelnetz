import getFrames, { FrameData } from './getFrames';
import Mimetypes from './mimetypes';
import {
  Matrix,
  splitToSize,
  getPixelsFromFrame,
  MAX_FRAMES,
} from './rasterization';
import rasterizePart, {
  PartRasterizationInput,
} from './rasterizePart';

export interface RasterizationData {
  getMatrixPart: () => AsyncIterableIterator<{
    matrix: Matrix;
    index: number;
  }>;
  stepLength: number;
  width: number;
  height: number;
  length: number;
  duration: number;
  numParts: number;
}

export const createGetMatrixPart = ({
  numParts,
  frameParts,
  minDelay,
  mimetype,
  width,
  height,
  channels,
  maxFrames,
}: {
  numParts: number;
  frameParts: FrameData[][];
  minDelay: number;
  mimetype: Mimetypes;
  width: number;
  height: number;
  channels: number;
  maxFrames?: number;
}) =>
  async function* getMatrixPart() {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < numParts; i++) {
      const part = frameParts[i];
      const input: PartRasterizationInput = {
        frames: part,
        minDelay,
        mimetype,
        offsetIndex: i,
        width,
        height,
        channels,
        maxFrames,
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

  const numParts = Math.ceil(frames.length / MAX_FRAMES);

  const frameParts = splitToSize(frames, MAX_FRAMES);

  const { width, height, channels } = await getPixelsFromFrame(
    frames[0].frame,
    mimetype,
  ).then(({ shape }) => {
    const [imageWidth, imageHeight, colorChannels] = shape;
    return {
      width: imageWidth,
      height: imageHeight,
      channels: colorChannels,
    };
  });

  return {
    stepLength: minDelay,
    width,
    height,
    length: frames.length,
    duration,
    getMatrixPart: createGetMatrixPart({
      numParts,
      frameParts,
      minDelay,
      mimetype,
      width,
      height,
      channels,
    }),
    numParts,
  };
};

export default rasterize;
