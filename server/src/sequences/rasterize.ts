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
import ThreadPool from '../threads/ThreadPool';

export interface RasterizationData {
  getMatrixPart: () => AsyncIterableIterator<{
    matrix: ClientMatrix;
    index: number;
  }>;
  getMatrixPartThreaded: () => Promise<
    {
      matrix: ClientMatrix;
      index: number;
    }[]
  >;
  stepLength: number;
  width: number;
  height: number;
  length: number;
  duration: number;
  numParts: number;
  maxFramesPerPart: number;
}

export const createGetMatrixPart = ({
  frameParts,
  minDelay,
  width,
  height,
  channels,
}: {
  frameParts: PixelGrid[][];
  minDelay: number;
  width: number;
  height: number;
  channels: number;
}) =>
  async function* getMatrixPart() {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < frameParts.length; i++) {
      const part = frameParts[i];
      const input: PartRasterizationInput = {
        frames: part,
        minDelay,
        width,
        height,
        channels,
      };
      yield {
        // eslint-disable-next-line no-await-in-loop
        matrix: await rasterizePart(input),
        index: i,
      };
    }
  };

export const createGetMatrixPartThreaded = ({
  frameParts,
  minDelay,
  width,
  height,
  channels,
}: {
  frameParts: PixelGrid[][];
  minDelay: number;
  width: number;
  height: number;
  channels: number;
}) =>
  async function getMatrixPart() {
    const pool = new ThreadPool<
      { input: PartRasterizationInput; index: number },
      {
        matrix: ClientMatrix;
        index: number;
      }
    >({
      path: `${__dirname}/rasterizeInWorker.js`,
    });

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < frameParts.length; i++) {
      const part = frameParts[i];
      const input: PartRasterizationInput = {
        frames: part,
        minDelay,
        width,
        height,
        channels,
      };
      pool.performAction({ input, index: i });
    }
    return new Promise<
      {
        matrix: ClientMatrix;
        index: number;
      }[]
    >(res => {
      let ops = 0;
      const results: {
        matrix: ClientMatrix;
        index: number;
      }[] = [];
      pool.onActionPerformed(({ result }) => {
        // eslint-disable-next-line no-plusplus
        ops++;
        results.push(result);
        if (ops === frameParts.length) {
          pool.close();
          res(results);
        }
      });
    });
  };

const rasterize = async (
  buffer: Buffer,
  mimetype: Mimetypes,
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
      minDelay,
      width,
      height,
      channels,
    }),
    getMatrixPartThreaded: createGetMatrixPartThreaded({
      frameParts,
      minDelay,
      width,
      height,
      channels,
    }),
    numParts: frameParts.length,
    maxFramesPerPart: maxFrames,
  };
};

export default rasterize;
