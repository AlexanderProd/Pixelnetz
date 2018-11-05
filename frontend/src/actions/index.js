import initTimeSync from './initTimeSync';
import startAnimation from './startAnimation';
import stopAnimation from './stopAnimation';
import position from './position';

const getActions = (send) => {
  const actions = {
    INIT_TIME_SYNC: initTimeSync(send),
    START_ANIMATION: startAnimation,
    STOP_ANIMATION: stopAnimation,
    POSITION: position(send),
  };

  return actions;
};

export default getActions;
