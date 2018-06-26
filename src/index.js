import React from 'react';
import ReactDOM from 'react-dom';
//import {hashHistory,Route,Router,IndexRoute} from 'react-router';
import { App } from './js/App';
import './css/App.css';
//import {Login} from './js/comps/login';


ReactDOM.render(
  <App />, document.getElementById('root')
);

/*
//<IndexRoute component={App}/>
ReactDOM.render((
    <Router history={hashHistory}>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
    </Router>),
  document.getElementById('root'));
*/