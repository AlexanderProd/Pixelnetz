import { createSequenceStack } from '../sequences';

const createAnimationController = (frameHandler) => {
  let _animation = null;
  let animationRunning = false;

  const setAnimation = (animation) => {
    _animation = animation;
  };

  const start = (startTime) => {
    animationRunning = true;

    const {
      stepLength,
      repeat,
      sequence,
    } = _animation;

    let sequenceStack = createSequenceStack(sequence, stepLength);

    let currentStep = sequenceStack.pop();

    let continueSequence = true;

    const loop = () => {
      const deltaTime = Date.now() - startTime;

      while (currentStep && currentStep[1] < deltaTime) {
        currentStep = sequenceStack.pop();
      }

      if (currentStep && sequenceStack.length > 0) {
        const [frame,, executed] = currentStep;

        if (!executed) {
          frameHandler(frame);
          currentStep.executed = false;
        }
      } else if (repeat) {
        startTime = Date.now();
        sequenceStack = createSequenceStack(sequence, stepLength);
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
