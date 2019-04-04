export const REMOVE_ERROR = 'error/REMOVE_ERROR';

const isFailure = type => type.split('_').pop() === 'FAILURE';
// eslint-disable-next-line no-unused-vars
const isSuccess = type => type.split('_').pop() === 'SUCCESS';
const isRequest = type => type.split('_').pop() === 'REQUEST';
const isNetworkType = type => type.includes('FAILURE') || type.includes('SUCCESS') || type.includes('REQUEST');

const extractFieldName = (type) => {
  const parts = type.split('_');
  if (!isNetworkType(type)) return type;
  parts.pop();
  return parts.join('_');
};

// Reducer
export default (state = null, action) => {
  const removeErrorKey = (key) => {
    const newState = { ...state };
    delete newState[extractFieldName(key)];
    return newState;
  };

  if (action.type === REMOVE_ERROR) {
    const newState = removeErrorKey(action.key);
    return newState;
  }

  const { type } = action;
  if (isFailure(type)) {
    return {
      ...(state || {}),
      [extractFieldName(type)]: action.response.error,
    };
  }
  if (state && isRequest(type) && state.hasOwnProperty(extractFieldName(type))) {
    return removeErrorKey(type);
  }
  return state;
};

export const removeError = key => ({
  type: REMOVE_ERROR,
  key,
});
