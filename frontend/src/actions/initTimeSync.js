import { INIT_TIME_SYNC } from '../../../shared/util/socketActionTypes';

const initTimeSync = send => (message) => {
  send({
    actionType: INIT_TIME_SYNC,
    initCounter: message.initCounter,
    clientReceive: Date.now(),
  });
};

export default initTimeSync;
