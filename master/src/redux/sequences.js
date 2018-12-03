import { FILE_UPLOAD_SUCCESS } from './fileUpload';

// ActionsTypes
export const SEQUENCE_SET_REQUEST = 'sequences/SEQUENCE_SET_REQUEST';
export const SEQUENCE_SET_SUCCESS = 'sequences/SEQUENCE_SET_SUCCESS';
export const SEQUENCE_SET_FAILURE = 'sequences/SEQUENCE_SET_FAILURE';
export const SEQUENCE_DELETE_REQUEST = 'sequences/SEQUENCE_DELETE_REQUEST';
export const SEQUENCE_DELETE_SUCCESS = 'sequences/SEQUENCE_DELETE_SUCCESS';
export const SEQUENCE_DELETE_FAILURE = 'sequences/SEQUENCE_DELETE_FAILURE';
export const SEQUENCE_GET_REQUEST = 'sequences/SEQUENCE_GET_REQUEST';
export const SEQUENCE_GET_SUCCESS = 'sequences/SEQUENCE_GET_SUCCESS';
export const SEQUENCE_GET_FAILURE = 'sequences/SEQUENCE_GET_FAILURE';

// Reducer
export default (state = [], action) => {
  switch (action.type) {
    case SEQUENCE_DELETE_REQUEST:
      return state.filter(name => name !== action.name);
    case SEQUENCE_DELETE_FAILURE:
      return [...state, action.name];
    case SEQUENCE_GET_SUCCESS:
      return action.response;
    case FILE_UPLOAD_SUCCESS:
      return [...state, action.name];
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

export const getSequences = () => ({
  fetch: 'GET',
  endpoint: '/savedFiles',
  types: [SEQUENCE_GET_REQUEST, SEQUENCE_GET_SUCCESS, SEQUENCE_GET_FAILURE],
});
