import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

import * as serviceWorker from './serviceWorker';
import reducer from './@shared/services/reducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Layout from './@shared/layout/Layout';
import DBUserManager from './@shared/services/db-user-manager';

//Redux store implemented
const store = createStore(reducer);
ReactDOM.render(
  <BrowserRouter>
    <Route path="/" render={(props) => <Provider store={store}><Layout {...props} /></Provider>} />
    <Redirect from="/" to="/home" />
  </BrowserRouter>,
  document.getElementById('root')
);

// Seed db tables
DBUserManager.seedTableData();

serviceWorker.register();