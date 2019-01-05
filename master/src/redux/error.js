const isFailure = type => type.split('_').pop() === 'FAILURE';
// eslint-disable-next-line no-unused-vars
const isSuccess = type => type.split('_').pop() === 'SUCCESS';
const isRequest = type => type.split('_').pop() === 'REQUEST';

const extractFieldName = (type) => {
  const parts = type.split('_');
  parts.pop();
  return parts.join('_');
};

// Reducer
export default (state = null, action) => {
  const { type } = action;
  if (isFailure(type)) {
    return {
      ...(state || {}),
      [extractFieldName(type)]: action.response.error,
    };
  }
  if (state && isRequest(type) && state.hasOwnProperty(extractFieldName(type))) {
    const newState = { ...state };
    delete newState[extractFieldName(type)];
    return newState;
  }
  return state;
};
