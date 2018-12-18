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

const createFrameStack = (sequence, stepLength) =>
  expandFrames([...sequence], stepLength).reverse();

export default createFrameStack;
