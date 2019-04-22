import getFrames from './getFrames';
import Mimetypes from './mimetypes';
import {
  Matrix,
  splitToSize,
  getPixelsFromFrame,
  MAX_FRAMES,
} from './rasterization';
import rasterizePart from './rasterizePart';

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

  const { imageWidth, imageHeight } = await getPixelsFromFrame(
    frames[0].frame,
    mimetype,
  ).then(({ shape }) => {
    const [width, height] = shape;
    return { imageWidth: width, imageHeight: height };
  });

  async function* getMatrixPart() {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < numParts; i++) {
      const part = frameParts[i];
      yield {
        // eslint-disable-next-line no-await-in-loop
        matrix: await rasterizePart({
          frames: part,
          minDelay,
          mimetype,
          offsetIndex: i,
        }),
        index: i,
      };
    }
  }

  return {
    stepLength: minDelay,
    width: imageWidth,
    height: imageHeight,
    length: frames.length,
    duration,
    getMatrixPart,
    numParts,
  };
};

export default rasterize;
