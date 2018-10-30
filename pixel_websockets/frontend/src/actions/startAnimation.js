import 'array-reverse-polyfill';
import { sosAnimation } from '../../../util/sequence';

const setColor = col => document.body.style = `background: ${col};`;

const expandSequence = (sequence, stepLength) => sequence
  .reduce((acc, [col, duration]) => [
    ...acc,
    ...([...new Array(duration)].map((x, i) => [col, stepLength * (acc.length + i), false])),
  ], []);

const createSequenceStack = (sequence, stepLength) => expandSequence([...sequence], stepLength).reverse();

const startAnimation = (message) => {
  const {
    stepLength,
    repeat,
    sequence,
  } = sosAnimation;

  let sequenceStack = createSequenceStack(sequence, stepLength);
  let { startTime } = message;

  let currentStep = sequenceStack.pop();

  let running = true;

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
        running = false;
      }
    }

    if (running) {
      requestAnimationFrame(loop);
    }

  };

  // start loop
  setTimeout(
    () => requestAnimationFrame(loop),
    startTime - Date.now(),
  );
};

export default startAnimation;
