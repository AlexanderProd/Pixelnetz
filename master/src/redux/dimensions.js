// ActionTypes
import { DIMENSIONS } from '../../../shared/dist/util/socketActionTypes';

const initialState = {
  xOffset: 0,
  yOffset: 0,
  width: 0,
  height: 0,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case DIMENSIONS:
      return action.message.dimensions;
    default:
      return state;
  }
};
