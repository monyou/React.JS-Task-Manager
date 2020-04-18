import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Layout from './@shared/layout/Layout';

ReactDOM.render(
  <BrowserRouter>
    <Route path="/" component={Layout} />
    <Redirect from="/" to="/home" />
  </BrowserRouter>,
  document.getElementById('root')
);

serviceWorker.register();
