import createFrameHandler from './frameHandler';

const setSequence = animationController => ({ sequence }) => {
  animationController.setSequence(sequence);
  animationController.setFrameHandler(createFrameHandler(sequence));
};

export default setSequence;
