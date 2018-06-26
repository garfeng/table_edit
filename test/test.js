import React from 'react';
import ReactDOM from 'react-dom';

//import '../src/css/bootstrap.default.css';
//import {hashHistory,Route,Router,IndexRoute} from 'react-router';




//import {Login} from '../src/js/comps/login';

const watcher = require('chokidar');
let pre = 'add';

watcher.watch("./src/js/").on('all', (e, path) => {
  if ((pre != 'add' && pre != 'addDir') || (e != 'add' && e != 'addDir')) {
    console.log(e, path);
    let href = location.href;
    let list = href.split("#");
    //console.log(list[0])
    //location.href = list[0];
    location.reload();
    //location.href="./";
    console.log("refresh");
    /*
    try {
      const now = new Date().toLocaleTimeString();
      const { App } = require("../src/js/App.jsx?ver=" + now);
      ReactDOM.render(
        <App />, document.getElementById('root')
      );
    } catch (error) {
      console.log(error);
    }
    */
  }
  pre = e;
  //location.reload();
});


try {
  const { App } = require("../src/js/App");
  ReactDOM.render(
    <App />, document.getElementById('root')
  );
} catch (error) {
  console.log(error);
}
//import { App } from '../src/js/App';




/*
//<IndexRoute component={App}/>
ReactDOM.render((
    <Router history={hashHistory}>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
    </Router>),
  document.getElementById('root'));
*/