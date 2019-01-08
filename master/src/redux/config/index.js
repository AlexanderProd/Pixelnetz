import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import thunk from 'redux-thunk';
import fetchMiddleware, { setStore } from '../middleware/fetch';
import connectStoreToWS from './ws';

import animationControl from '../animationControl';
import animationStart from '../animationStart';
import auth from '../auth';
import connections from '../connections';
import dimensions from '../dimensions';
import error from '../error';
import fileUpload from '../fileUpload';
import masterSequence from '../masterSequence';
import sequences from '../sequences';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const reducer = combineReducers({
  animationControl,
  animationStart,
  auth,
  connections,
  dimensions,
  error,
  fileUpload,
  masterSequence,
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
    fetchMiddleware({
      // HOSTNAME & PORT kommen aus webpack.DefinePlugin
      // und wird im Buildprozess gesetzt
      // eslint-disable-next-line no-undef
      baseUrl: `http://${HOSTNAME}${PORT ? ':' : ''}${PORT}`,
    }),
  )),
);

setStore(store);

connectStoreToWS(store);

export const persistor = persistStore(store);

export default store;
