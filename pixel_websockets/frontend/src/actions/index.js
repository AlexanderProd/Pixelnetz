import animation from './animation';
import initTimeSync from './initTimeSync';
import position from './position';

const getActions = (send) => {
  const actions = {
    ANIMATION: animation,
    INIT_TIME_SYNC: initTimeSync(send),
    POSITION: position(send),
  };

  return actions;
};

export default getActions;
