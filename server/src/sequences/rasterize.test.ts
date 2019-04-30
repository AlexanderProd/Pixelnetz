import test from 'ava';
import rasterize, { createGetMatrixPart } from './rasterize';
import { setConstant } from './rasterisationConstants';
import Mimetypes from './mimetypes';
import { FrameData, DEFAULT_DELAY } from './getFrames';
import { splitToSize, ClientMatrix } from './rasterization';
import TEST_PNG from './__testdata__/png';
import { mapFramesToPixelGrid } from './getPixelsFromFrame';

const createData: (length: number) => Promise<FrameData[]> = async (
  length: number,
) => {
  const frame = TEST_PNG;
  return [...new Array(length)].map((x, index) => ({
    frame,
    index,
    delay: 200,
  }));
};

const testResolution = 2;
const testMaxFrames = 5;

test.beforeEach(() => {
  setConstant('RESOLUTION', testResolution);
  setConstant('MAX_FRAMES', testMaxFrames);
});

test('rasterize: it returns correct rasterizationData', async t => {
  const data = await rasterize(TEST_PNG, Mimetypes.PNG);
  const expected = {
    stepLength: DEFAULT_DELAY,
    width: 2,
    height: 3,
    length: 1,
    duration: DEFAULT_DELAY,
    numParts: 1,
  };

  // eslint-disable-next-line guard-for-in
  for (const key in expected) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t.is((data as any)[key], (expected as any)[key]);
  }
});

test('createGetMatrixPart: it returns the correct matrix', async t => {
  const data: FrameData[] = await createData(1);
  const pixel = await mapFramesToPixelGrid(data, Mimetypes.PNG);
  const frameParts = splitToSize(pixel, 5);

  const generateMatrix = createGetMatrixPart({
    frameParts,
    minDelay: 200,
    width: 2,
    height: 3,
    channels: 4,
  });

  const expected: ClientMatrix = [
    [['#000000', 1]],
    [['#ffffff', 1]],
    [['#888888', 1]],
    [['#00ff00', 1]],
    [['#0000ff', 1]],
    [['#ff0000', 1]],
  ];

  const { matrix, index } = (await generateMatrix().next()).value;

  t.is(index, 0);
  t.deepEqual(matrix, expected);
});