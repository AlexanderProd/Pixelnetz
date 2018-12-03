// ActionsTypes
export const FILE_UPLOAD_REQUEST = 'upload/FILE_UPLOAD_REQUEST';
export const FILE_UPLOAD_SUCCESS = 'upload/FILE_UPLOAD_SUCCESS';
export const FILE_UPLOAD_FAILURE = 'upload/FILE_UPLOAD_FAILURE';

const initialState = {
  loading: false,
  success: false,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case FILE_UPLOAD_REQUEST:
      return {
        loading: true,
        success: false,
      };
    case FILE_UPLOAD_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case FILE_UPLOAD_FAILURE:
      return {
        loading: false,
        success: false,
      };
    default:
      return state;
  }
};

// ActionCreators
export const upload = ({ data, mimeType, name }) => ({
  fetch: 'POST-MULTIPART',
  endpoint: '/upload',
  expect: 'text',
  data,
  mimeType,
  name,
  types: [FILE_UPLOAD_REQUEST, FILE_UPLOAD_SUCCESS, FILE_UPLOAD_FAILURE],
});
