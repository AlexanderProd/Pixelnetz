// ActionTypes
import {
  SET_SEQUENCE,
  APPEND_SEQUENCE,
} from '../../../shared/dist/util/socketActionTypes';

// Reducer
export default (state = null, action) => {
  switch (action.type) {
    case SET_SEQUENCE:
      return {
        initial: action.message.sequence,
        append: null,
      };
    case APPEND_SEQUENCE:
      return {
        ...state,
        append: action.message.sequence,
      };
    default:
      return state;
  }
};
