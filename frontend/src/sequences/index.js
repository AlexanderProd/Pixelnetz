export const expandFrames = (frames, stepLength) => {
  const expanded = [];
  let frameTime = 0;
  for (const [color, duration] of frames) {
    frameTime += stepLength * duration;
    expanded.push([
      color,
      frameTime,
      false,
    ]);
  }
  return expanded;
};

export const createFrameStack = (sequence, stepLength) =>
  expandFrames([...sequence], stepLength).reverse();
