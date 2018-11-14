import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import thunk from 'redux-thunk';
import fetchMiddleware, { setStore } from '../middleware/fetch';
import baseUrl from '../../../../shared/util/baseUrl';

import animationControl from '../animationControl';
import auth from '../auth';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const reducer = combineReducers({
  animationControl,
  auth,
});

const persistedReducer = persistReducer(
  persistConfig,
  reducer,
);

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(
    thunk,
    fetchMiddleware({ baseUrl: baseUrl() }),
  )),
);

setStore(store);

export const persistor = persistStore(store);

export default store;
