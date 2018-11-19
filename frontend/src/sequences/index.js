export const expandSequence = (sequence, stepLength) => sequence
  .reduce((acc, [col, duration]) => [
    ...acc,
    ...([...new Array(duration)]
      .map((x, i) => [col, stepLength * (acc.length + i), false])),
  ], []);

export const createSequenceStack = (sequence, stepLength) =>
  expandSequence([...sequence], stepLength).reverse();
