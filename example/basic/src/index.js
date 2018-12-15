import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';

import './assets/css/styles.scss';
import App from './App';
import { store } from './state';

function main() {
  if (store.storage) {
    store.storage.load()
      .catch(err => { console.warn(err); });
  }
  ReactDOM.render(
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>,
    document.getElementById('root')
  );
}
main();
