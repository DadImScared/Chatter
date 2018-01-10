
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import Base from './components/base';
const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();


ReactDOM.render((
  <BrowserRouter>
    <Base />
  </BrowserRouter>
), document.getElementById('root'));
// registerServiceWorker();
