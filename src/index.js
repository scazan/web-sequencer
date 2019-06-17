import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import SixteenStep from './views/SixteenStep/SixteenStep';
import * as serviceWorker from './serviceWorker';

const routing = (
  <Router>
    <Switch>
      <Route path="/step" component={ SixteenStep } />
      <Route path="/" component={ App } />
    </Switch>
  </Router>
);

ReactDOM.render(
  routing,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
