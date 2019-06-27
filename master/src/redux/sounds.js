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
      return state.filter(
        sound => sound.fileName !== action.sound.fileName,
      );
    case SOUND_DELETE_FAILURE:
      return [...state, action.sound];
    case SOUND_SET_REQUEST:
      return state.map(sound =>
        sound.fileName === action.sound.fileName
          ? { ...sound, isSelected: !sound.isSelected }
          : sound,
      );
    case SOUND_SET_FAILURE:
      return state.map(sound =>
        sound.fileName === action.sound.fileName
          ? action.sound
          : sound,
      );
    case ALL_AUDIO_FILES:
      return action.message.data;
    default:
      return state;
  }
};

// ActionCreators
export const toggleSound = sound => ({
  fetch: 'GET',
  endpoint: `/toggleAudio?name=${
    sound.name
  }&value=${!sound.isSelected}`,
  sound,
  expect: 'text',
  types: [SOUND_SET_REQUEST, SOUND_SET_SUCCESS, SOUND_SET_FAILURE],
});

export const deleteSound = sound => ({
  fetch: 'GET',
  endpoint: `/deleteAudio?name=${sound.name}`,
  expect: 'text',
  sound,
  types: [
    SOUND_DELETE_REQUEST,
    SOUND_DELETE_SUCCESS,
    SOUND_DELETE_FAILURE,
  ],
});
