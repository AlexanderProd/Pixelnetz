// ActionTypes
import {
  CONNECTION_ADDED,
  CONNECTION_REMOVED,
  CURRENT_CONNECTIONS,
} from '../../../shared/util/socketActionTypes';

// Reducer
export default (state = [], action) => {
  switch (action.type) {
    case CURRENT_CONNECTIONS:
      return action.message.connections;
    case CONNECTION_ADDED:
      return [
        ...state,
        action.message.connection,
      ];
    case CONNECTION_REMOVED:
      return state.filter(({ id }) => id !== action.message.id);
    default:
      return state;
  }
};
