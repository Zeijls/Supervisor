import React from 'react';
import ReactDOM from 'react-dom';

import { register, unregister } from './registerServiceWorker';

import { createBrowserHistory } from 'history';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router-dom';

import config from '@config';
import createStore, { StoreContext } from '@stores';

import App from '@src/App';

const browserHistory = createBrowserHistory();
const routing = new RouterStore();
const store = createStore(config);

const history = syncHistoryWithStore(browserHistory, routing);

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <Router history={history}>
      <App />
    </Router>
  </StoreContext.Provider>,
  document.getElementById('root')
);

if (process.env.NODE_ENV === 'production') {
  register();
} else {
  unregister();
}
