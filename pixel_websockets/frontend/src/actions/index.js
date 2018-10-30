import startAnimation from './startAnimation';
import initTimeSync from './initTimeSync';
import position from './position';

const getActions = (send) => {
  const actions = {
    START_ANIMATION: startAnimation,
    INIT_TIME_SYNC: initTimeSync(send),
    POSITION: position(send),
  };

  return actions;
};

export default getActions;
