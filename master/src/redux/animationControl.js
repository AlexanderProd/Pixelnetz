// ActionsTypes
export const ANIMATION_START_REQUEST = 'animationControl/ANIMATION_START_REQUEST';
export const ANIMATION_START_SUCCESS = 'animationControl/ANIMATION_START_SUCCESS';
export const ANIMATION_START_FAILURE = 'animationControl/ANIMATION_START_FAILURE';
export const ANIMATION_STOP_REQUEST = 'animationControl/ANIMATION_STOP_REQUEST';
export const ANIMATION_STOP_SUCCESS = 'animationControl/ANIMATION_STOP_SUCCESS';
export const ANIMATION_STOP_FAILURE = 'animationControl/ANIMATION_STOP_FAILURE';
export const ANIMATION_SET_REQUEST = 'animationControl/ANIMATION_SET_REQUEST';
export const ANIMATION_SET_SUCCESS = 'animationControl/ANIMATION_SET_SUCCESS';
export const ANIMATION_SET_FAILURE = 'animationControl/ANIMATION_SET_FAILURE';

const initialState = {
  startError: false,
  stopError: false,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case ANIMATION_START_SUCCESS:
      return {
        ...state,
        startError: false,
      };
    case ANIMATION_START_FAILURE:
      return {
        ...state,
        startError: true,
      };
    case ANIMATION_STOP_SUCCESS:
      return {
        ...state,
        stopError: false,
      };
    case ANIMATION_STOP_FAILURE:
      return {
        ...state,
        stopError: true,
      };
    default:
      return state;
  }
};

// ActionCreators
export const startAnimation = () => ({
  fetch: 'GET',
  endpoint: '/start',
  expect: 'text',
  types: [ANIMATION_START_REQUEST, ANIMATION_START_SUCCESS, ANIMATION_START_FAILURE],
});

export const stopAnimation = () => ({
  fetch: 'GET',
  endpoint: '/stop',
  expect: 'text',
  types: [ANIMATION_STOP_REQUEST, ANIMATION_STOP_SUCCESS, ANIMATION_STOP_FAILURE],
});

export const setAnimation = sequenceName => ({
  fetch: 'GET',
  endpoint: `/setAnimation?name=${sequenceName}`,
  expect: 'text',
  types: [ANIMATION_SET_REQUEST, ANIMATION_SET_SUCCESS, ANIMATION_SET_FAILURE],
});
