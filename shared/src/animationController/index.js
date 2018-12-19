import createFrameStack from './createFrameStack';

const DELTA_PADDING = 1000;

const createAnimationController = (frameHandler) => {
  let sequence = null;
  let sequenceRunning = false;

  const setSequence = (_sequence) => {
    sequence = _sequence;
    sequenceRunning = false;
  };

  const start = (startTime) => {
    sequenceRunning = true;

    const {
      stepLength,
      repeat,
      frames,
    } = sequence;

    let frameStack = createFrameStack(frames, stepLength);

    let currentStep = frameStack.pop();

    let continueSequence = true;

    const loop = () => {
      const deltaTime = Date.now() - startTime;

      while (currentStep && currentStep[1] < deltaTime) {
        currentStep = frameStack.pop();
      }

      if (currentStep && frameStack.length >= 0) {
        const [frame,, executed] = currentStep;

        if (!executed) {
          frameHandler(frame);
          currentStep[2] = false;
        }
      } else if (repeat) {
        startTime = Date.now();
        frameStack = createFrameStack(frames, stepLength);
        currentStep = frameStack.pop();
      } else {
        continueSequence = false;
      }

      if (continueSequence && sequenceRunning) {
        requestAnimationFrame(loop);
      }
    };

    // start loop
    setTimeout(
      () => requestAnimationFrame(loop),
      startTime - Date.now(),
    );
  };

  const stop = () => {
    sequenceRunning = false;
  };

  return {
    setSequence,
    start,
    stop,
  };
};

export default createAnimationController;
