// ActionTypes
import {
  NEW_CONNECTIONS,
  CLOSED_CONNECTIONS,
  CURRENT_CONNECTIONS,
} from '../../../shared/dist/util/socketActionTypes';

// Reducer
export default (state = [], action) => {
  switch (action.type) {
    case CURRENT_CONNECTIONS:
      return action.message.connections;
    case NEW_CONNECTIONS:
      return [
        ...state,
        ...action.message.connections,
      ];
    case CLOSED_CONNECTIONS: {
      const closedConnections = new Set(action.message.ids);
      return state.filter(({ id }) => !closedConnections.has(id));
    }
    default:
      return state;
  }
};
