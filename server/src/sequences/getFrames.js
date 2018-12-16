import gifFrames from 'gif-frames';
import mimetypes from './mimetypes';

const toBuffer = stream => new Promise((res, rej) => {
  const buffers = [];
  stream.on('data', data => buffers.push(data));
  stream.on('end', () => res(Buffer.concat(buffers)));
  stream.on('error', rej);
});

const getFrames = async (buffer, mimetype) => {
  if (mimetype !== mimetypes.GIF) {
    return [{
      frame: buffer,
      index: 0,
      delay: 1000,
    }];
  }

  const frames = await gifFrames({
    url: buffer,
    frames: 'all',
    outputType: 'png',
  });

  return Promise.all(frames.map(async ({
    getImage,
    frameInfo,
    frameIndex,
  }) => {
    const imgBuffer = await toBuffer(getImage());
    return {
      frame: imgBuffer,
      index: frameIndex,
      delay: frameInfo.delay,
    };
  }));
};

export default getFrames;
