/**
  shape:

  {
    startTime: Number, // angepasst auf client versatz
    stepLength: Number, // in ms
    repeat: Boolean,
    sequence: [
      ['#fff' (farbwert), 4 (anzahl wiederholungen)],
      ['#000' (farbwert), 1 (anzahl wiederholungen)],
      ...
    ],
  }
*/

const s = [
  ['#fff', 1],
  ['#000', 1],
  ['#fff', 1],
  ['#000', 1],
  ['#fff', 1],
];

const o = [
  ['#fff', 6],
  ['#000', 1],
  ['#fff', 6],
  ['#000', 1],
  ['#fff', 6],
];

export const sos = [
  ...s,
  ['#000', 3],
  ...o,
  ['#000', 3],
  ...s,
  ['#000', 3],
];

export const sosAnimation = {
  stepLength: 200,
  repeat: false,
  frames: sos,
};
