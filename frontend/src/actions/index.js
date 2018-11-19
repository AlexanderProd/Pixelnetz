import initTimeSync from './initTimeSync';
import setAnimation from './setAnimation';
import startAnimation from './startAnimation';
import stopAnimation from './stopAnimation';
import position from './position';
import createAnimationController from './animationController';
import { sosAnimation } from '../../../shared/util/sequence';

const setColor = col => document.body.style.backgroundColor = col;

const createActionRunner = (send) => {
  const animationController = createAnimationController(setColor);
  animationController.setAnimation(sosAnimation);

  const actions = {
    INIT_TIME_SYNC: initTimeSync(send),
    SET_ANIMATION: setAnimation(animationController),
    START_ANIMATION: startAnimation(animationController),
    STOP_ANIMATION: stopAnimation(animationController),
    POSITION: position(send),
  };

  return (message) => {
    const { actionType } = message;
    actions[actionType](message);
  };
};

export default createActionRunner;
