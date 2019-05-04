export const expandFrames = (frames, stepLength, frameOffset = 0) => {
  const expanded = [];
  let frameTime = 0;
  for (const [frame, duration] of frames) {
    frameTime += stepLength * duration;
    expanded.push({
      frame,
      frameTime: frameTime + frameOffset,
      executed: false,
      duration,
    });
  }
  return expanded;
};

export default expandFrames;
