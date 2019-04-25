import { Stream } from 'stream';
import gifFrames from '../@types/gif-frames';
import Mimetypes from './mimetypes';

export interface FrameData {
  frame: Buffer;
  index: number;
  delay: number;
}

export const DEFAULT_DELAY = 1000;

const toBuffer = (stream: Stream): Promise<Buffer> =>
  new Promise((res, rej) => {
    const buffers: any[] = [];
    stream.on('data', data => buffers.push(data));
    stream.on('end', () => res(Buffer.concat(buffers)));
    stream.on('error', rej);
  });

const getFrames = async (
  buffer: Buffer,
  mimetype: Mimetypes,
): Promise<FrameData[]> => {
  if (mimetype !== Mimetypes.GIF) {
    return [
      {
        frame: buffer,
        index: 0,
        delay: DEFAULT_DELAY,
      },
    ];
  }

  const frames = await gifFrames({
    url: buffer,
    frames: 'all',
    outputType: 'png',
  });

  return Promise.all(
    frames.map(async ({ getImage, frameInfo, frameIndex }) => {
      const imgBuffer = await toBuffer(getImage());
      return {
        frame: imgBuffer,
        index: frameIndex,
        delay: frameInfo.delay,
      };
    }),
  );
};

export default getFrames;
