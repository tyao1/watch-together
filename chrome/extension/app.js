import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
// import './app.css';

// Load state from background
chrome.runtime.sendMessage('@@INIT', function resp(response) {
  const createStore = require('../../app/store/configureStore');
  const store = createStore({
    initialState: response,
    portIdentifier: 'ex',
  });
  ReactDOM.render(
    <Root store={store} />,
    document.querySelector('#root')
  );
});
