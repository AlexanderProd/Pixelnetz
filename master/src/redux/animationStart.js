// ActionTypes
import {
  START_ANIMATION,
  STOP_ANIMATION,
} from '../../../shared/dist/util/socketActionTypes';

// Reducer
export default (state = null, action) => {
  switch (action.type) {
    case START_ANIMATION:
      return action.message.startTime;
    case STOP_ANIMATION:
      return null;
    default:
      return state;
  }
};
