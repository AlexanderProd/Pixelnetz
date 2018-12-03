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

const baseUrl = getBaseUrl();

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(
    thunk,
    fetchMiddleware({ baseUrl }),
  )),
);

setStore(store);

fetch(`${baseUrl}/wshost`)
  .then(r => r.json())
  .then(({ hostname }) => connectStoreToWS({
    store,
    hostname,
    port: 3002,
  }));

export const persistor = persistStore(store);

export default store;
