import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import thunk from 'redux-thunk';
import fetchMiddleware, { setStore } from '../middleware/fetch';
import getBaseUrl from '../../../../shared/util/baseUrl';
import connectStoreToWS from './ws';

import animationControl from '../animationControl';
import auth from '../auth';
import connections from '../connections';
import error from '../error';
import fileUpload from '../fileUpload';
import sequences from '../sequences';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const reducer = combineReducers({
  animationControl,
  auth,
  connections,
  error,
  fileUpload,
  sequences,
});

const persistedReducer = persistReducer(
  persistConfig,
  reducer,
);

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(
    thunk,
    // HOSTNAME kommt aus webpack.DefinePlugin und wird im Buildprozess gesetzt
    // eslint-disable-next-line no-undef
    fetchMiddleware({ baseUrl: `http://${HOSTNAME}:3000` }),
  )),
);

setStore(store);

connectStoreToWS({
  store,
  // HOSTNAME kommt aus webpack.DefinePlugin und wird im Buildprozess gesetzt
  // eslint-disable-next-line no-undef
  hostname: HOSTNAME,
  port: 3002,
});

export const persistor = persistStore(store);

export default store;
