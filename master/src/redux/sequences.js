import { ALL_SEQUENCES } from '../../../shared/dist/util/socketActionTypes';

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
      return state.filter(({ name }) => name !== action.name);
    case SEQUENCE_DELETE_FAILURE:
      return [...state, action.sequence];
    case ALL_SEQUENCES:
      return action.message.data;
    default:
      return state;
  }
};

// ActionCreators
export const setSequence = ({
  name,
  repeat,
  stepLength,
}) => ({
  fetch: 'GET',
  endpoint: `/setAnimation?name=${name}&repeat=${repeat}&stepLength=${stepLength}`,
  expect: 'text',
  types: [SEQUENCE_SET_REQUEST, SEQUENCE_SET_SUCCESS, SEQUENCE_SET_FAILURE],
});

export const deleteSequence = sequence => ({
  fetch: 'GET',
  endpoint: `/deleteSequence?name=${sequence.name}`,
  expect: 'text',
  sequence,
  types: [SEQUENCE_DELETE_REQUEST, SEQUENCE_DELETE_SUCCESS, SEQUENCE_DELETE_FAILURE],
});
