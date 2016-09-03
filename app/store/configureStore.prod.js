import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import storage from '../utils/storage';

export default function ({
  initialState,
  portIdentifier,
  isBackground = false,
  globalKey,
}) {
  const portName = portIdentifier + Date.now();
  let apMiddleware;
  if (isBackground) {
    apMiddleware = applyMiddleware(thunk);
  } else {
    const syncMiddleware = require('../middlewares/syncActions');
    const realSync = syncMiddleware.withKeys(portName);
    apMiddleware = applyMiddleware(thunk, realSync);
  }

  let extraDispatcher;

  if (isBackground) {
    extraDispatcher = require('../utils/backgroundDispatcher')(portIdentifier, globalKey);
  } else {
    extraDispatcher = require('../utils/foregroundDispatcher')(portName);
  }

  const enhancer = compose(
    apMiddleware,
    isBackground ? storage() : nope => nope,
    extraDispatcher,
  );
  return createStore(rootReducer, initialState, enhancer);
}
