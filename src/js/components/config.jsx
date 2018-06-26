import React, {
  Component
} from 'react';

import {
  HashRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import { Col, Input, Button, FormText, Table, Form, Badge, Alert, Row } from "reactstrap";

import { MainBody, InputGroupM } from "../common";

class CommonInfo extends Component {

}

class EditPanel extends Component {
  render() {
    return <Form>
      <InputGroupM title="项目类型">
        <Input type="select" value={this.props.data.type} onChange={this.onChange.bind(this, "type")}>
          <option value="short">短字符串</option>
          <option value="long">长字符串</option>
          <option value="tags">Tags</option>
        </Input>
      </InputGroupM>
      <InputGroupM title="位置">
        <Input type="select" value={this.props.data.position} onChange={this.onChange.bind(this, "position")}>
          <option value="概要信息">短字符串</option>
          <option value="表格外">长字符串</option>
          <option value="表格内">Tags</option>
        </Input>
      </InputGroupM>

      <InputGroupM title="位置">
        <Input value={this.props.data.type} onChange={this.onChange.bind(this, "position")}>
          <option value="概要信息">短字符串</option>
          <option value="表格外">长字符串</option>
          <option value="表格内">Tags</option>
        </Input>
      </InputGroupM>
    </Form>;
  }
}

export class EditConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

  }
}