import player from '../audio';

const stopAnimation = animationController => () => {
  player.setVolume(0);
  animationController.stop();
};

export default stopAnimation;
