/*
  Enhance the store to receive and emit actions
*/

export default function createBackgroundEnhancer(portIdentifier, globalKey = 'global') {
  if (!portIdentifier) {
    throw new Error('portIdentifier is required in options');
  }
  return createStore => (reducer, initialState) => {
    const store = createStore(reducer, initialState);

    function onMessage(request, sender, sendResponse) {
      console.log('request', request);
      if (request === '@@INIT') {
        sendResponse(store.getState());
        return;
      }
      // send actions to other active pages
      store.dispatch(request.payload);
      delete request.payload[globalKey];
      for (const [key, port] of ports) {
        if (request.portName === key) continue;
        port.postMessage(request.payload);
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
    const ports = new Map();
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
