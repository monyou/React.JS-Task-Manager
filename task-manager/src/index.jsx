import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Layout from './@shared/layout/Layout';
import UserModel from './@shared/models/user.model';

ReactDOM.render(
  <BrowserRouter>
    <Route path="/" component={Layout} />
    <Redirect from="/" to="/home" />
  </BrowserRouter>,
  document.getElementById('root')
);

// Seed db tables
localStorage.setItem('users', JSON.stringify([new UserModel('admin@admin.com', 'admin123', 'Admin Admin', 'admin')]));

serviceWorker.register();