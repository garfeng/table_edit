import React, {
    Component
} from 'react';
//import Rb from 'react-bootstrap';
//import logo from '../media/logo.svg';
//import '../css/App.css';
//import '../css/bootstrap.default.css';
import {
    HashRouter as Router,
    Route,
    Link
} from 'react-router-dom';

import {
    Home, PrintPage
} from './components/home';

import { Test } from "./components/test";

/*
<div>
<div className="print-hide">
    <Link to="/">home</Link> |
    <Link to="print">print</Link>
</div>
</div>
*/

export class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/print" component={PrintPage} />
                </div>
            </Router>
        );
    }
}

