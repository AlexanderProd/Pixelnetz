import test from 'ava';
import { createGetMatrixPart } from './rasterize';
import Mimetypes from './mimetypes';
import { FrameData } from './getFrames';
import { splitToSize } from './rasterization';
import TEST_PNG from './__testdata__/png';

const createData: () => Promise<FrameData[]> = async () => {
  const frame = TEST_PNG;
  return [...new Array(20)].map((x, index) => ({
    frame,
    index,
    delay: 200,
  }));
};

test.only('stress test', async t => {
  const data: FrameData[] = await createData();
  const frameParts = splitToSize(data, 5);

  // const single = createGetMatrixPart({
  //   frameParts,
  //   mimetype: Mimetypes.PNG,
  //   minDelay: 200,
  //   numParts: frameParts.length,
  // });
  // for await (const m of single()) {
  //   console.log(m);
  // }
  // t.true(1 === 1);
});
