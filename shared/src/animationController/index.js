import FrameQueue from '../FrameQueue';

const createAnimationController = frameHandler => {
  let sequenceRunning = false;
  let sequence;
  let frameQueue = null;
  let hasSequence = false;

  const setSequence = _sequence => {
    sequence = _sequence;
    sequenceRunning = false;
    hasSequence = true;
  };

  const start = startTime => {
    if (!hasSequence) return;

    frameQueue = new FrameQueue(sequence);

    sequenceRunning = true;

    let currentStep;

    let continueSequence = true;

    const setStep = () => {
      currentStep = frameQueue.dequeue();
      if (sequence.repeat) {
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
        if (!currentStep.executed) {
          frameHandler(currentStep.frame);
          currentStep.executed = true;
        }
      } else if (sequence.repeat) {
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

  const appendSequence = _sequence => {
    if (_sequence) {
      sequence.frames = sequence.frames.concat(_sequence.frames);
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
