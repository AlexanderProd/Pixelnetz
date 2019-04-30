/* eslint-disable no-plusplus, no-await-in-loop, no-console */
import largeJpeg from './large_jpeg';
import gif from './gif';
import rasterize from '../rasterize';
import Mimetypes from '../mimetypes';
import { setConstant } from '../rasterisationConstants';

const testPerf = async ({
  buffer,
  mimetype,
  resolution = 100,
  maxFrames = 50,
  numIterations = 10,
}: {
  buffer: Buffer;
  mimetype: Mimetypes;
  resolution?: number;
  maxFrames?: number;
  numIterations?: number;
}) => {
  setConstant('RESOLUTION', resolution);
  setConstant('MAX_FRAMES', maxFrames);
  const timestamps = [];
  for (let i = 0; i < numIterations; i++) {
    const start = Date.now();
    const res = await rasterize(buffer, mimetype);
    for await (const x of res.getMatrixPart()) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { index } = x;
    }
    const finish = Date.now();
    const dif = finish - start;
    timestamps.push(dif);
    console.log(`${i + 1}/${numIterations}: ${dif}`);
  }
  const sum = timestamps.reduce((acc, dif) => acc + dif, 0);
  const avg = sum / timestamps.length;
  const med = timestamps.sort((a, b) => {
    if (a === b) return 0;
    return a < b ? 1 : -1;
  })[Math.floor(timestamps.length / 2)];
  console.log(`\nAVG Time: ${avg}`);
  console.log(`MED Time: ${med}`);
};

const run = async () => {
  console.log('Start perf test for large jpeg');
  await testPerf({
    buffer: largeJpeg,
    mimetype: Mimetypes.JPEG,
    resolution: 1600,
  });

  console.log('\n\nStart perf test for large gif');
  await testPerf({
    buffer: gif,
    mimetype: Mimetypes.GIF,
    resolution: 100,
  });

  console.log(
    '\n\nStart perf test for large gif with maxFrames = 10',
  );
  await testPerf({
    buffer: gif,
    mimetype: Mimetypes.GIF,
    resolution: 100,
    maxFrames: 10,
  });
};

run();
