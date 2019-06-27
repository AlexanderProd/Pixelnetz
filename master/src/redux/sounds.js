import { ALL_AUDIO_FILES } from '../../../shared/src/util/socketActionTypes';

// ActionsTypes
export const SOUND_SET_REQUEST = 'sounds/SOUND_SET_REQUEST';
export const SOUND_SET_SUCCESS = 'sounds/SOUND_SET_SUCCESS';
export const SOUND_SET_FAILURE = 'sounds/SOUND_SET_FAILURE';
export const SOUND_DELETE_REQUEST = 'sounds/SOUND_DELETE_REQUEST';
export const SOUND_DELETE_SUCCESS = 'sounds/SOUND_DELETE_SUCCESS';
export const SOUND_DELETE_FAILURE = 'sounds/SOUND_DELETE_FAILURE';

// Reducer
export default (state = [], action) => {
  switch (action.type) {
    case SOUND_DELETE_REQUEST:
      return state.filter(({ name }) => name !== action.name);
    case SOUND_DELETE_FAILURE:
      return [...state, action.sound];
    case ALL_AUDIO_FILES:
      return action.message.data;
    default:
      return state;
  }
};

// ActionCreators
export const setSound = ({ name }) => ({
  fetch: 'GET',
  endpoint: `/setSound?name=${name}`,
  expect: 'text',
  types: [SOUND_SET_REQUEST, SOUND_SET_SUCCESS, SOUND_SET_FAILURE],
});

export const deleteSound = sound => ({
  fetch: 'GET',
  endpoint: `/deleteSound?name=${sound.name}`,
  expect: 'text',
  sound,
  types: [
    SOUND_DELETE_REQUEST,
    SOUND_DELETE_SUCCESS,
    SOUND_DELETE_FAILURE,
  ],
});
