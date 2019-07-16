import player from '../audio';

const stopAnimation = animationController => () => {
  animationController.stop();
  requestAnimationFrame(() => player.setVolume(0));
};

export default stopAnimation;
