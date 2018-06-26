import React, {
  Component
} from 'react';

import { Col } from "reactstrap";

import { MainBody } from "../common";


export class Test extends Component {
  render() {
    return <MainBody>
      <Col md={12}>
        {JSON.stringify(this.props.match, " ")}
      </Col>
    </MainBody>;
  }
}