import Mimetypes from './mimetypes';
import getPixels from '../@types/get-pixels';
import PixelData from '../@types/get-pixels/PixelData';
import { RESOLUTION } from './rasterisationConstants';
import { getSharpMimetype, PixelGrid } from './rasterization';
import { FrameData } from './getFrames';

import sharp = require('sharp');

function getPixelsFromFrame(
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

export function mapFramesToPixelGrid(
  frames: FrameData[],
  mimetype: Mimetypes,
): Promise<PixelGrid[]> {
  return Promise.all(
    frames.map(({ frame, delay, index }) =>
      getPixelsFromFrame(frame, mimetype).then(({ data, shape }) => ({
        delay,
        index,
        data,
        shape,
      })),
    ),
  );
}

export default getPixelsFromFrame;
