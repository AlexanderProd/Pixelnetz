import {
  INIT_TIME_SYNC,
  SET_SEQUENCE,
  START_ANIMATION,
  STOP_ANIMATION,
  APPEND_SEQUENCE,
  POSITION,
  SELECTED_AUDIO_FILES,
  PING,
} from '../../../shared/dist/util/socketActionTypes';
import initTimeSync from './initTimeSync';
import setSequence from './setSequence';
import startAnimation from './startAnimation';
import stopAnimation from './stopAnimation';
import appendSequence from './appendSequence';
import position from './position';
import loadAudioFiles from './loadAudioFiles';
import pong from './pong';
import createAnimationController from '../../../shared/dist/animationController';
import { sosAnimation } from '../../../shared/dist/util/sequence';

function createActionRunner(send) {
  const animationController = createAnimationController();
  animationController.setSequence(sosAnimation);

  const actions = {
    [INIT_TIME_SYNC]: initTimeSync(send),
    [SET_SEQUENCE]: setSequence(animationController),
    [START_ANIMATION]: startAnimation(animationController),
    [STOP_ANIMATION]: stopAnimation(animationController),
    [APPEND_SEQUENCE]: appendSequence(animationController),
    [POSITION]: position(send),
    [SELECTED_AUDIO_FILES]: loadAudioFiles(),
    [PING]: pong(send),
  };

  return message => {
    const { actionType } = message;
    if (actionType in actions) {
      actions[actionType](message);
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        `No handler registered for ActionType: '${actionType}'. Action will be ignored.`,
      );
    }
  };
}

export default createActionRunner;
