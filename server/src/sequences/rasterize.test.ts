import test from 'ava';
import { splitToSize } from './rasterize';

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
