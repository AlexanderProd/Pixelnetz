import {
  Matrix,
  getPixelsFromFrame,
  prepareMatrix,
} from './rasterization';
import { FrameData } from './getFrames';
import Mimetypes from './mimetypes';
import { roundFloat, toHex } from '../util/numbers';
import { MAX_FRAMES } from './rasterisationConstants';
import ThreadPool from '../threads/ThreadPool';

export interface PartRasterizationInput {
  frames: {
    data: number[];
    shape: [number, number, number];
    index: number;
    delay: number;
  }[];
  minDelay: number;
  mimetype: Mimetypes;
  offsetIndex: number;
  width: number;
  height: number;
  channels: number;
  maxFrames?: number;
}

async function rasterizePart({
  frames,
  minDelay,
  mimetype,
  offsetIndex,
  width,
  height,
  channels,
  maxFrames = MAX_FRAMES,
}: PartRasterizationInput): Promise<Matrix> {
  const matrix: Matrix = prepareMatrix(width, height, frames.length);
  const maxOps = width * height * frames.length;

  // const pixel = await Promise.all(
  //   frames.map(({ frame, delay, index }) =>
  //     getPixelsFromFrame(frame, mimetype).then(({ data, shape }) => ({
  //       delay,
  //       index,
  //       pixel: { data, shape },
  //     })),
  //   ),
  // );

  const pool = new ThreadPool({
    path: `${__dirname}/raster.js`,
  });

  const partLength = Math.floor(frames.length / pool.numThreads);
  const parts = [...new Array(pool.numThreads)].map((x, i) =>
    frames.slice(i * partLength, i * partLength + partLength),
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

  //     ({ frame, delay, index }): Promise<void> => {
  //       const delayFactor = roundFloat(delay / minDelay, 2);
  //       return getPixelsFromFrame(frame, mimetype).then(
  //         ({ data, shape }): void => {
  //           const [imageWidth, imageHeight, colorChannels] = shape;
  //           if (
  //             imageWidth !== width ||
  //             imageHeight !== height ||
  //             colorChannels !== channels
  //           ) {
  //             throw new Error(
  //               'Image dimensions do not match frame dimensions',
  //             );
  //           }

  //           for (let pos = 0; pos < data.length; pos += channels) {
  //             const r = data[pos];
  //             const g = data[pos + 1];
  //             const b = data[pos + 2];
  //             const col = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  //             const i = pos / channels;
  //             const x = i % width;
  //             const y = Math.floor(i / width);

  //             matrix[width * y + x][
  //               index - offsetIndex * maxFrames
  //             ] = [col, delayFactor];
  //           }
  //         },
  //       );
  //     },
  //   ),
  // );

  return matrix;
}

export default rasterizePart;
