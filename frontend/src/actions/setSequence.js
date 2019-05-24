import createFrameHanlder from './frameHandler';

const setSequence = animationController => ({ sequence }) => {
  animationController.setSequence(sequence);
  animationController.setFrameHandler(createFrameHanlder(sequence));
};

export default setSequence;
