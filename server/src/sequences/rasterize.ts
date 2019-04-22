import sharp from 'sharp';
import getPixels, { PixelData } from '../@types/get-pixels';
import getFrames, { FrameData } from './getFrames';
import Mimetypes from './mimetypes';

export type Frame = [any, number];
export type Matrix = Frame[][];

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

const RESOLUTION = 100;
const MAX_FRAMES = 50;

const toHex = (num: number): string =>
  num.toString(16).padStart(2, '0');
const roundFloat = (num: number, precision: number): number =>
  Number(num.toFixed(precision));

const getSharpMimetype = (type: Mimetypes): Mimetypes => {
  switch (type) {
    case Mimetypes.GIF:
      return Mimetypes.PNG;
    default:
      return type;
  }
};

const prepareMatrix = (
  width: number,
  height: number,
  frameLength: number,
): Matrix => {
  const matrix = new Array(width * height);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < width * height; i++) {
    matrix[i] = new Array(frameLength);
  }

  return matrix;
};

function getPixelsFromFrame(frame: Buffer, mimetype: Mimetypes) {
  return sharp(frame)
    .resize(RESOLUTION)
    .toBuffer()
    .then(
      (b: Buffer): Promise<PixelData> =>
        getPixels(b, getSharpMimetype(mimetype)),
    );
}

export function splitToSize<T>(arr: T[], size: number): T[][] {
  const newArr: T[][] = [];
  for (let step = 0; step < arr.length; step += size) {
    newArr.push([]);
    // eslint-disable-next-line no-plusplus
    for (let i = step; i < step + size; i++) {
      if (i >= arr.length) break;
      newArr[Math.floor(step / size)].push(arr[i]);
    }
  }
  return newArr;
}

async function rasterizePart({
  frames,
  minDelay,
  mimetype,
  offsetIndex,
}: {
  frames: FrameData[];
  minDelay: number;
  mimetype: Mimetypes;
  offsetIndex: number;
}) {
  let matrix: Matrix = [];
  await Promise.all(
    frames.map(
      ({ frame, delay, index }): Promise<void> => {
        const delayFactor = roundFloat(delay / minDelay, 2);
        return getPixelsFromFrame(frame, mimetype).then(
          ({ data, shape }): void => {
            const [width, height, channels] = shape;

            if (matrix.length === 0) {
              matrix = prepareMatrix(width, height, frames.length);
            }

            for (let pos = 0; pos < data.length; pos += channels) {
              const r = data[pos];
              const g = data[pos + 1];
              const b = data[pos + 2];
              const col = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

              const i = pos / channels;
              const x = i % width;
              const y = Math.floor(i / width);

              matrix[width * y + x][
                index - offsetIndex * MAX_FRAMES
              ] = [col, delayFactor];
            }
          },
        );
      },
    ),
  );

  return matrix;
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
