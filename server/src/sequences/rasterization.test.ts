import test, { ExecutionContext } from 'ava';
import fs from 'fs';
import { promisify } from 'util';
import {
  getSharpMimetype,
  prepareMatrix,
  splitToSize,
} from './rasterization';
import Mimetypes from './mimetypes';
import getPixelsFromFrame from './getPixelsFromFrame';

const readFile = promisify(fs.readFile);

const TEST_PNG = readFile(`${__dirname}/__testdata__/png.png`);

function getSharpMimetypeMacro(
  t: ExecutionContext,
  input: Mimetypes,
  expected: Mimetypes,
) {
  const res = getSharpMimetype(input);
  t.is(res, expected);
}

test(
  'getSharpMimetype: it returns PNG for GIF',
  getSharpMimetypeMacro,
  Mimetypes.GIF,
  Mimetypes.PNG,
);

test(
  'getSharpMimetype: PNG => PNG',
  getSharpMimetypeMacro,
  Mimetypes.PNG,
  Mimetypes.PNG,
);

test(
  'getSharpMimetype: JPEG => JPEG',
  getSharpMimetypeMacro,
  Mimetypes.JPEG,
  Mimetypes.JPEG,
);

test('prepareMatrix: it returns an empty matrix with correct dimensions', t => {
  const width = 3;
  const height = 2;
  const frameLength = 2;
  const matrix = prepareMatrix(width, height, frameLength);
  const f = new Array(frameLength);
  const actual = [f, f, f, f, f, f];
  t.deepEqual(matrix, actual);
});

test('getPixelsFromFrame: extracts correct pixelvalues', async t => {
  const buf = await TEST_PNG;
  const res = await getPixelsFromFrame(buf, Mimetypes.PNG, 2);
  const actual = {
    shape: [2, 3, 4],
    data: [
      ...[0, 0, 0, 255],
      ...[255, 255, 255, 255],
      ...[136, 136, 136, 255],
      ...[0, 255, 0, 255],
      ...[0, 0, 255, 255],
      ...[255, 0, 0, 255],
    ],
  };
  t.deepEqual(res.shape, actual.shape);
  t.deepEqual([...res.data], actual.data);
});

test('splitToSize: evenly splittable', t => {
  const x = [1, 2, 3, 4];
  const y = [[1, 2], [3, 4]];
  const res = splitToSize(x, 2);
  t.deepEqual(res, y);
});

test('splitToSize: not evenly splittable', t => {
  const x = [1, 2, 3, 4, 5];
  const y = [[1, 2], [3, 4], [5]];
  const res = splitToSize(x, 2);
  t.deepEqual(res, y);
});

test('splitToSize: long array', t => {
  const x = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
  ];
  const y = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20],
  ];
  const res = splitToSize(x, 5);
  t.deepEqual(res, y);
});

test('splitToSize: size > length', t => {
  const x = [1, 2, 3, 4];
  const y = [[1, 2, 3, 4]];
  const res = splitToSize(x, 7);
  t.deepEqual(res, y);
});
