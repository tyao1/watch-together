import { APP_ID } from '../config';

function createGlobalMiddleware(portName, key = 'global') {
  return (/* { dispatch, getState } */) => next => action => {
    if (action && (action[key] || action.wild)) {
      /*
       Send action to background
       If it should be synced across page
       Or it should fire to wilddog
      */
      chrome.runtime.sendMessage(APP_ID, {
        portName,
        payload: action,
      });
    }
    return next(action);
  };
}

const syncActionMiddleware = createGlobalMiddleware();
export default syncActionMiddleware;

syncActionMiddleware.withKeys = createGlobalMiddleware;
