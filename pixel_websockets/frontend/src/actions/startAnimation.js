import { sosAnimation } from '../../../util/sequence';

const setColor = col => document.body.style = `background: ${col};`;

const expandSequence = sequence => sequence
  .reduce((acc, [col, duration]) => ([
    ...acc,
    ...([...new Array(duration)].map(() => [col, false])),
  ]), []);

const startAnimation = (message) => {
  const {
    stepLength,
    repeat,
  } = sosAnimation;
  const sequence = expandSequence(sosAnimation.sequence);
  let { startTime } = message;

  console.log(Date.now() - startTime);

  let stepCount = 0;
  let [currentStep] = sequence;

  let running = true;

  const loop = () => {
    const deltaTime = Date.now() - startTime;
    const currentStepTime = stepCount * stepLength;
    const nextStepTime = (stepCount + 1) * stepLength;

    console.log(stepCount);

    if (deltaTime >= currentStepTime && deltaTime < nextStepTime) {
      const [col, executed] = currentStep;

      if (!executed) {
        setColor(col);
        currentStep.executed = false;

        if (stepCount === sequence.length - 1) {
          if (repeat) {
            stepCount = 0;
            startTime = Date.now();
            [currentStep] = sequence;
          } else {
            running = false;
          }
        } else {
          stepCount += 1;
          currentStep = sequence[stepCount];
        }
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
