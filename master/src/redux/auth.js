// ActionsTypes
export const AUTH_REQUEST = 'auth/AUTH_REQUEST';
export const AUTH_SUCCESS = 'auth/AUTH_SUCCESS';
export const AUTH_FAILURE = 'auth/AUTH_FAILURE';
export const LOGOUT = 'auth/LOGOUT';

// Reducer
export default (state = null, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return action.response;
    case AUTH_FAILURE:
    case LOGOUT:
      return null;
    default:
      return state;
  }
};

// ActionCreators
export const authenticate = password => ({
  fetch: 'POST',
  endpoint: '/authenticate',
  data: { password },
  types: [AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE],
});

export const logout = () => ({
  type: LOGOUT,
});
