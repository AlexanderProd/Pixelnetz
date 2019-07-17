import player from '../audio';

const stopAnimation = animationController => () => {
  animationController.stop();
  // The volume levels are managed in the animationController
  // loop, which uses requestAnimationFrame for scheduling.
  // This means, that if we mute the player here, it could
  // still be unmuted if the animation frame fires after
  // this call.
  // To be sure that the mute runs after the loop finishes
  // we schedule another animation frame.
  requestAnimationFrame(() => player.setVolume(0));
};

export default stopAnimation;
