/*

  Enhance the store to receive and emit actions
  Also include wilddog here,
  Since this is where all actions are dispatched in background runtime.

*/
import Wild from './wilddog';

export default function createBackgroundEnhancer(portIdentifier, globalKey = 'global') {
  if (!portIdentifier) {
    throw new Error('portIdentifier is required in options');
  }
  return createStore => (reducer, initialState) => {
    const store = createStore(reducer, initialState);
    const ports = new Map();

    function dispatchAll(action) {
      store.dispatch(action);
      for (const [key, port] of ports) {
        port.postMessage(action);
      }
    }

    const server = new Wild({
      authDomain: '17kan.wilddogio.com',
      syncURL: 'https://17kan.wilddogio.com',
    }, dispatchAll);


    function onMessage(request, sender, sendResponse) {
      console.log('request', request);
      if (request === '@@INIT') {
        sendResponse(store.getState());
        return;
      }

      if (request.payload.wild) {
        // it's wilddog action sync it to the server

        console.log('Wilddog', request.payload);
        server.process(request.payload);

      } else {
        // send actions to other active pages
        store.dispatch(request.payload);
        delete request.payload[globalKey];
        for (const [key, port] of ports) {
          if (request.portName === key) continue;
          port.postMessage(request.payload);
        }
      }

    }

    function onConnect(port) {
      console.log(port);
      if (port.name.indexOf(portIdentifier) < 0) {
        return;
      }
      const { name } = port;
      ports.set(name, port);

      port.onDisconnect.addListener((() => {
        ports.delete(name);
      }));
    }
    chrome.runtime.onMessage.addListener(onMessage);
    chrome.runtime.onMessageExternal.addListener(onMessage);

    /**
     * Record active ports
     */
    chrome.runtime.onConnect.addListener(onConnect);
    chrome.runtime.onConnectExternal.addListener(onConnect);
    return store;
  };
}
