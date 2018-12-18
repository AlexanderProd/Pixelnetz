import {
  INIT_TIME_SYNC,
  SET_SEQUENCE,
  START_ANIMATION,
  STOP_ANIMATION,
  POSITION,
} from '../../../shared/util/socketActionTypes';
import initTimeSync from './initTimeSync';
import setSequence from './setSequence';
import startAnimation from './startAnimation';
import stopAnimation from './stopAnimation';
import position from './position';
import createAnimationController from '../../../shared/animationController';
import { sosAnimation } from '../../../shared/util/sequence';

const setColor = col => document.body.style.backgroundColor = col;

const createActionRunner = (send) => {
  const animationController = createAnimationController(setColor);
  animationController.setSequence(sosAnimation);

  const actions = {
    [INIT_TIME_SYNC]: initTimeSync(send),
    [SET_SEQUENCE]: setSequence(animationController),
    [START_ANIMATION]: startAnimation(animationController),
    [STOP_ANIMATION]: stopAnimation(animationController),
    [POSITION]: position(send),
  };

  return (message) => {
    const { actionType } = message;
    actions[actionType](message);
  };
};

export default createActionRunner;
