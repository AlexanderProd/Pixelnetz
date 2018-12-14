import gifFrames from 'gif-frames';
import mimetypes from './mimetypes';

const toBuffer = stream => new Promise((res, rej) => {
  const buffers = [];
  stream.on('data', data => buffers.push(data));
  stream.on('end', () => res(Buffer.concat(buffers)));
  stream.on('error', rej);
});

const getFrames = (buffer, mimetype) => ({
  forEach(cb) {
    if (mimetype !== mimetypes.GIF) {
      cb(buffer);
    } else {
      gifFrames({ url: buffer, frames: 'all', outputType: 'png' })
        .then(frames => frames.forEach(async ({ getImage }) => {
          const imgBuffer = await toBuffer(getImage());
          cb(imgBuffer);
        }))
        .catch((e) => {
          throw e;
        });
    }
  },
});

export default getFrames;
