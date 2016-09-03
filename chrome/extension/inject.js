import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import Root from '../../app/containers/Root';
import { APP_ID } from '../../app/config';

// Load state from background
chrome.runtime.sendMessage(APP_ID, '@@INIT', function resp(response) {
  console.log('sendMessage?', response);
  const createStore = require('../../app/store/configureStore');
  const store = createStore({
    initialState: response,
    portIdentifier: 'ex',
  });
  const injectDOM = document.createElement('div');
  injectDOM.className = 'injectView';
  document.body.insertBefore(injectDOM, document.body.firstChild);
  ReactDOM.render(
    <Root store={store} />,
    injectDOM,
  );
});
