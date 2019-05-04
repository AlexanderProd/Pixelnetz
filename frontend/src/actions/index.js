import {
  INIT_TIME_SYNC,
  SET_SEQUENCE,
  START_ANIMATION,
  STOP_ANIMATION,
  APPEND_SEQUENCE,
  POSITION,
} from '../../../shared/dist/util/socketActionTypes';
import initTimeSync from './initTimeSync';
import setSequence from './setSequence';
import startAnimation from './startAnimation';
import stopAnimation from './stopAnimation';
import appendSequence from './appendSequence';
import position from './position';
import createAnimationController from '../../../shared/dist/animationController';
import { sosAnimation } from '../../../shared/dist/util/sequence';
import { decodeColor } from '../../../shared/dist/util/colors';

const setColor = encodedColor => {
  const [r, g, b] = decodeColor(encodedColor);
  document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
};

const createActionRunner = send => {
  const animationController = createAnimationController(setColor);
  animationController.setSequence(sosAnimation);

  const actions = {
    [INIT_TIME_SYNC]: initTimeSync(send),
    [SET_SEQUENCE]: setSequence(animationController),
    [START_ANIMATION]: startAnimation(animationController),
    [STOP_ANIMATION]: stopAnimation(animationController),
    [APPEND_SEQUENCE]: appendSequence(animationController),
    [POSITION]: position(send),
  };

  return message => {
    const { actionType } = message;
    actions[actionType](message);
  };
};

export default createActionRunner;
