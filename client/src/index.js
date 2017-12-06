import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import Base from './components/base';
import registerServiceWorker from './registerServiceWorker';
const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();


ReactDOM.render((
  <BrowserRouter>
    <Base />
  </BrowserRouter>
), document.getElementById('root'));
// registerServiceWorker();
