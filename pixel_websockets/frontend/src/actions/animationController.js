import 'array-reverse-polyfill';
import { createSequenceStack } from '../sequences';

const setColor = col => document.body.style = `background: ${col};`;

let animationRunning = false;

export const start = (animation, startTime) => {
  animationRunning = true;

  const {
    stepLength,
    repeat,
    sequence,
  } = animation;

  let sequenceStack = createSequenceStack(sequence, stepLength);

  let currentStep = sequenceStack.pop();

  let continueSequence = true;

  const loop = () => {
    const deltaTime = Date.now() - startTime;

    while (currentStep && currentStep[1] < deltaTime) {
      currentStep = sequenceStack.pop();
    }

    if (currentStep && sequenceStack.length > 0) {
      const [col,, executed] = currentStep;

      if (!executed) {
        setColor(col);
        currentStep.executed = false;
      }
    } else {
      if (repeat) {
        startTime = Date.now();
        sequenceStack = createSequenceStack(sequence, stepLength);
        currentStep = sequenceStack.pop();
      } else {
        continueSequence = false;
      }
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

export const stop = () => {
  animationRunning = false;
};
