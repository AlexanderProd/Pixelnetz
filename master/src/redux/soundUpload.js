// ActionsTypes
export const SOUND_UPLOAD_REQUEST = 'upload/SOUND_UPLOAD_REQUEST';
export const SOUND_UPLOAD_SUCCESS = 'upload/SOUND_UPLOAD_SUCCESS';
export const SOUND_UPLOAD_FAILURE = 'upload/SOUND_UPLOAD_FAILURE';

const initialState = {
    loading: false,
    success: false,
};

// Reducer
export default (state = initialState, action) => {
    switch (action.type) {
        case SOUND_UPLOAD_REQUEST:
            return {
                loading: true,
                success: false,
            };
        case SOUND_UPLOAD_SUCCESS:
            return {
                loading: false,
                success: true,
            };
        case SOUND_UPLOAD_FAILURE:
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
    expect: 'text',
    data,
    mimeType,
    name,
    types: [
        SOUND_UPLOAD_REQUEST,
        SOUND_UPLOAD_SUCCESS,
        SOUND_UPLOAD_FAILURE,
    ],
});
