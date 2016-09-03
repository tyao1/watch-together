require('./background/contextMenus');
require('./background/inject');
// require('./background/badge');

chrome.storage.local.get('state', obj => {
  const { state } = obj;
  const initialState = JSON.parse(state || '{}');

  const createStore = require('../../app/store/configureStore');
  // initialize background reducer
  const store = createStore({
    initialState,
    portIdentifier: 'ex',
    isBackground: true
  });
});
