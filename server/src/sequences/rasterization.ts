import Mimetypes from './mimetypes';
import PixelData from '../@types/get-pixels/PixelData';

export type Frame<FrameType> = [FrameType, number];
export type Matrix<FrameType> = Frame<FrameType>[][];

export type ClientFrame = Frame<string>;
export type ClientMatrix = Matrix<string>;

export type MasterFrame = Frame<string[]>;
export type MasterMatrix = MasterFrame[];

export interface PixelGrid extends PixelData {
  index: number;
  delay: number;
}

export const getSharpMimetype = (type: Mimetypes): Mimetypes => {
  switch (type) {
    case Mimetypes.GIF:
      return Mimetypes.PNG;
    default:
      return type;
  }
};

export function prepareMatrix<FrameType>(
  width: number,
  height: number,
  frameLength: number,
): Matrix<FrameType> {
  const matrix = new Array(width * height);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < width * height; i++) {
    matrix[i] = new Array(frameLength);
  }

  return matrix;
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
