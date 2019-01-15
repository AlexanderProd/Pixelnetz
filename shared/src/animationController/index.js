import FrameQueue from '../FrameQueue';

const createAnimationController = (frameHandler) => {
  let sequenceRunning = false;
  let repeat = null;
  let frameQueue = null;
  let hasSequence = false;

  const setSequence = (_sequence) => {
    ({ repeat } = _sequence);

    frameQueue = new FrameQueue(_sequence);

    sequenceRunning = false;
    hasSequence = true;
  };

  const start = (startTime) => {
    if (!hasSequence) return;

    sequenceRunning = true;

    let currentStep;

    let continueSequence = true;

    const setStep = () => {
      currentStep = frameQueue.dequeue();
      if (repeat) {
        frameQueue.appendFrame(currentStep);
      }
    };

    // Set first step
    setStep();

    const loop = () => {
      const deltaTime = Date.now() - startTime;

      while (currentStep && currentStep.frameTime < deltaTime) {
        setStep();
      }

      if (currentStep && frameQueue.size() >= 0) {
        const { frame, executed } = currentStep;

        if (!executed) {
          frameHandler(frame);
          currentStep.executed = true;
        }
      } else if (repeat) {
        // Maybe this will be neccessary when appending sequences
        // startTime = Date.now();
        // frameQueue = new Queue(expandFrames(frames, stepLength));
        // currentStep = frameQueue.dequeue();
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

  const appendSequence = (sequence) => {
    if (sequence) {
      frameQueue.appendSequence(sequence);
    }
  };

  return {
    setSequence,
    start,
    stop,
    appendSequence,
  };
};

export default createAnimationController;
