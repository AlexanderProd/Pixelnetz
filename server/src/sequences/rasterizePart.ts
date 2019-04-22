import {
  Matrix,
  getPixelsFromFrame,
  prepareMatrix,
  MAX_FRAMES,
} from './rasterization';
import { FrameData } from './getFrames';
import Mimetypes from './mimetypes';
import { roundFloat, toHex } from '../util/numbers';

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
}): Promise<Matrix> {
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

export default rasterizePart;
