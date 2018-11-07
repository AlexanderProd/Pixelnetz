export const AUTH_REQUEST = 'playlist/AUTH_REQUEST';
export const AUTH_SUCCESS = 'playlist/AUTH_SUCCESS';
export const AUTH_FAILURE = 'playlist/AUTH_FAILURE';

export default (state = null, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return action.response;
    default:
      return state;
  }
};

export const authenticate = data => ({
  fetch: 'POST',
  endpoint: '/authenticate',
  data,
  types: [AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE],
});
