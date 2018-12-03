import { ALL_SEQUENCES } from '../../../shared/util/socketActionTypes';

// ActionsTypes
export const SEQUENCE_SET_REQUEST = 'sequences/SEQUENCE_SET_REQUEST';
export const SEQUENCE_SET_SUCCESS = 'sequences/SEQUENCE_SET_SUCCESS';
export const SEQUENCE_SET_FAILURE = 'sequences/SEQUENCE_SET_FAILURE';
export const SEQUENCE_DELETE_REQUEST = 'sequences/SEQUENCE_DELETE_REQUEST';
export const SEQUENCE_DELETE_SUCCESS = 'sequences/SEQUENCE_DELETE_SUCCESS';
export const SEQUENCE_DELETE_FAILURE = 'sequences/SEQUENCE_DELETE_FAILURE';

// Reducer
export default (state = [], action) => {
  switch (action.type) {
    case SEQUENCE_DELETE_REQUEST:
      return state.filter(name => name !== action.name);
    case SEQUENCE_DELETE_FAILURE:
      return [...state, action.name];
    case ALL_SEQUENCES:
      return action.message.data;
    default:
      return state;
  }
};

// ActionCreators
export const setSequence = sequenceName => ({
  fetch: 'GET',
  endpoint: `/setAnimation?name=${sequenceName}`,
  expect: 'text',
  types: [SEQUENCE_SET_REQUEST, SEQUENCE_SET_SUCCESS, SEQUENCE_SET_FAILURE],
});

export const deleteSequence = name => ({
  fetch: 'GET',
  endpoint: `/deleteSequence?name=${name}`,
  expect: 'text',
  name,
  types: [SEQUENCE_DELETE_REQUEST, SEQUENCE_DELETE_SUCCESS, SEQUENCE_DELETE_FAILURE],
});
