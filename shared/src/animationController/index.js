import expandFrames from './expandFrames';
import Queue from '../Queue';

const createAnimationController = (frameHandler) => {
  let sequenceRunning = false;
  let stepLength = null;
  let repeat = null;
  let frameQueue = null;
  let hasSequence = false;

  const setSequence = (_sequence) => {
    ({ stepLength, repeat } = _sequence);

    frameQueue = new Queue(
      expandFrames(_sequence.frames, stepLength),
    );

    sequenceRunning = false;
    hasSequence = true;
  };

  const start = (startTime) => {
    if (!hasSequence) return;

    sequenceRunning = true;

    let currentStep = frameQueue.dequeue();

    let continueSequence = true;

    const loop = () => {
      const deltaTime = Date.now() - startTime;

      while (currentStep && currentStep.frameTime < deltaTime) {
        currentStep = frameQueue.dequeue();
        if (repeat) {
          frameQueue.enqueue({
            ...currentStep,
            frameTime: (currentStep.duration * stepLength) +
              frameQueue.tail().frameTime,
          });
        }
      }

      if (currentStep && frameQueue.size() >= 0) {
        const { frame, executed } = currentStep;

        if (!executed) {
          frameHandler(frame);
          currentStep.executed = true;
        }
      } else if (repeat) {
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

  return {
    setSequence,
    start,
    stop,
  };
};

export default createAnimationController;
