/**
 * Created by jry on 17-3-31.
 */
import React, {
  Component
} from 'react';
import ReactDOM from "react-dom";

import {
  Link, Redirect, NavLink
} from 'react-router-dom';



import PropTypes from "prop-types";

import { Row, Container, Col, FormGroup, Label } from "reactstrap";

export const Icon = (props) => {
  let { i = "", size = 2, className = "" } = props;

  if (i == "") {
    return null;
  }

  i = "fa fa-" + i;
  const sizeS = "fa-" + size + "x";

  var newprop = {};
  Object.assign(newprop, props);
  delete newprop.i;
  delete newprop.size;
  delete newprop.className;

  return (
    <i {...newprop} className={i + " " + sizeS + " " + className}></i>
  );
};


Number.prototype.format = function (bit = 1, blank = 0) {
  let str = `${this}`;
  if (str.length < bit) {
    const forNum = (bit - str.length);
    for (let i = 0; i < forNum; i++) {
      str = `${blank}${str}`;
    }
  }
  return str;
};

export class InputGroupM extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <FormGroup row style={{ width: "100%" }}>
        <Label for={this.props.id} sm={this.props.tl || 5} >
          {this.props.title}
        </Label>
        <Col sm={12 - (this.props.tl || 5)}>{this.props.children}</Col>
      </FormGroup>
    );
  }
}

export class MainBody extends Component {
  render() {
    return <Container  {...this.props}>
      {this.props.children}
    </Container>;
  }
}