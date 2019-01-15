export const expandFrames = (frames, stepLength) => {
  const expanded = [];
  let frameTime = 0;
  let i = 0;
  for (const [frame, duration] of frames) {
    frameTime += stepLength * duration;
    expanded.push({
      frame,
      frameTime,
      executed: false,
      duration,
      i: i++,
    });
  }
  return expanded;
};

export default expandFrames;
