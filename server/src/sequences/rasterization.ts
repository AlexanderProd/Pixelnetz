import sharp from 'sharp';
import Mimetypes from './mimetypes';
import getPixels from '../@types/get-pixels/getPixels';
import { PixelData } from '../@types/get-pixels';

export const RESOLUTION = 100;
export const MAX_FRAMES = 50;

export type Frame = [any, number];
export type Matrix = Frame[][];

export const getSharpMimetype = (type: Mimetypes): Mimetypes => {
  switch (type) {
    case Mimetypes.GIF:
      return Mimetypes.PNG;
    default:
      return type;
  }
};

export const prepareMatrix = (
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

export function getPixelsFromFrame(
  frame: Buffer,
  mimetype: Mimetypes,
  resolution: number = RESOLUTION,
): Promise<PixelData> {
  return sharp(frame)
    .resize(resolution)
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