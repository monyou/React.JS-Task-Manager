import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

import * as serviceWorker from './serviceWorker';
import reducer from './@shared/services/reducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from "react-router-dom";
import Layout from './@shared/layout/Layout';
import DBUserManager from './@shared/services/db-user-manager';

//Redux store implemented
const initialState = {
  isLogged: false,
  loggedUser: null,
  loggedUserRole: null
};
if (!localStorage.getItem('state')) {
  localStorage.setItem('state', JSON.stringify(initialState));
}
const store = createStore(reducer);
store.subscribe(() => {
  localStorage.setItem('state', JSON.stringify(store.getState()));
});
ReactDOM.render(
  <BrowserRouter>
    <Route path="/" render={(props) => <Provider store={store}><Layout {...props} /></Provider>} />
  </BrowserRouter>,
  document.getElementById('root')
);

// Seed db tables
DBUserManager.seedTableData();

serviceWorker.register();