/**
  shape:

  {
    startTime: Number, // angepasst auf client versatz
    stepLength: Number, // in ms
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
  ['#fff', 3],
  ['#000', 1],
  ['#fff', 3],
  ['#000', 1],
  ['#fff', 3],
];

const sos = {
  startTime: Date.now() + 5000,
  stepLength: 300,
  sequence: [
    ...s,
    ['#000', 3],
    ...o,
    ['#000', 3],
    ...s,
  ],
};
