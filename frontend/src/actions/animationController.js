import { createFrameStack } from '../sequences';

const DELTA_PADDING = 1000;

const createAnimationController = (frameHandler) => {
  let animation = null;
  let animationRunning = false;

  const setAnimation = (_animation) => {
    animation = _animation;
  };

  const start = (startTime) => {
    animationRunning = true;

    const {
      stepLength,
      repeat,
      sequence,
    } = animation;

    let sequenceStack = createFrameStack(sequence, stepLength);

    let currentStep = sequenceStack.pop();

    let continueSequence = true;

    const loop = () => {
      const deltaTime = Date.now() - startTime - DELTA_PADDING;

      while (currentStep && currentStep[1] < deltaTime) {
        currentStep = sequenceStack.pop();
      }

      if (currentStep && sequenceStack.length >= 0) {
        const [frame,, executed] = currentStep;

        if (!executed) {
          frameHandler(frame);
          currentStep.executed = false;
        }
      } else if (repeat) {
        startTime = Date.now();
        sequenceStack = createFrameStack(sequence, stepLength);
        currentStep = sequenceStack.pop();
      } else {
        continueSequence = false;
      }

      if (continueSequence && animationRunning) {
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
    animationRunning = false;
  };

  return {
    setAnimation,
    start,
    stop,
  };
};

export default createAnimationController;
