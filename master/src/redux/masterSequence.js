// ActionTypes
import { SET_SEQUENCE } from '../../../shared/dist/util/socketActionTypes';

// Reducer
export default (state = null, action) => {
  switch (action.type) {
    case SET_SEQUENCE:
      return action.message.sequence;
    default:
      return state;
  }
};
