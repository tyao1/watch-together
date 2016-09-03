import { APP_ID } from '../config';

/*
  Enhance the store to receive and emit actions
*/

export default function createForegroundEnhancer(portName) {
  if (!portName) {
    throw new Error('portName is required in options');
  }
  return createStore => (reducer, initialState) => {
    const store = createStore(reducer, initialState);
    // Connect to the background
    const port = chrome.runtime.connect(APP_ID, { name: portName });
    console.log(APP_ID);

    // Listen to actions sent by background
    port.onMessage.addListener((request, sender, sendResponse) => {
      // if (request.type === '@@ACTION') {
      store.dispatch(request);
      /*} else if (request.type === '@@INIT') {
        console.log('replace state');
        store.state = request.payload;
      }*/
    });

    return store;
  };
}
