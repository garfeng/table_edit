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

import marked from "marked";

class DataReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: ""
    };

    this.OpenFileDialog = this.OpenFileDialog.bind(this);
    this.OnFileSelected = this.OnFileSelected.bind(this);
    this.OnFileReadOk = this.OnFileReadOk.bind(this);
  }

  OpenFileDialog() {
    this.refs["input_config"].click();
  }

  OnFileReadOk(e) {
    let data = JSON.parse(e.target.result);
    console.log(data);
    if (typeof this.props.onReady == "function") {
      this.props.onReady(data);
    }
  }

  OnFileSelected(e) {
    this.setState({ file: e.target.value });
    let resultFile = e.target.files[0];
    if (resultFile) {
      let reader = new FileReader();
      reader.onload = this.OnFileReadOk;
      reader.readAsText(resultFile, 'UTF-8');
    }
  }

  render() {
    return <div>
      <InputGroupM title="选择数据文件" >
        <input type="file" id="input_config" ref="input_config" style={{ display: "none" }} onChange={this.OnFileSelected} accept="config/json" />
        <Button outline color="primary" onClick={this.OpenFileDialog}>选择</Button>
        <FormText color="muted">{this.state.file}</FormText>
      </InputGroupM>
    </div>;
  }
}

class Config extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: ""
    };

    this.OpenFileDialog = this.OpenFileDialog.bind(this);
    this.OnFileSelected = this.OnFileSelected.bind(this);
    this.OnFileReadOk = this.OnFileReadOk.bind(this);
  }

  OpenFileDialog() {
    this.refs["input_config"].click();
  }

  OnFileReadOk(e) {
    let config = JSON.parse(e.target.result);
    console.log(config);
    if (typeof this.props.onReady == "function") {
      this.props.onReady(config);
    }
  }

  OnFileSelected(e) {
    this.setState({ file: e.target.value });
    let resultFile = e.target.files[0];
    if (resultFile) {
      let reader = new FileReader();
      reader.onload = this.OnFileReadOk;
      reader.readAsText(resultFile, 'UTF-8');
    }
  }

  render() {
    return <div>
      <InputGroupM title="选择配置文件">
        <input type="file" id="input_config" ref="input_config" style={{ display: "none" }} onChange={this.OnFileSelected} accept="config/json" />
        <Button outline color="primary" onClick={this.OpenFileDialog}>选择</Button>
        <FormText color="muted">{this.state.file}</FormText>
      </InputGroupM>
    </div>;
  }
}

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgs: [],
      visible: false
    };

    this.push = this.push.bind(this);

    this.onDismiss = this.onDismiss.bind(this);
    this.checkHide = this.checkHide.bind(this);
    this.timeId = null;
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  OneItem(d, i) {
    return <p key={i}>{d.show_time} : {d.info}</p>;
  }

  componentWillUnmount() {
    if (this.timeId != null) {
      clearInterval(this.timeId);
      this.timeId = null;
    }
  }

  checkHide() {
    var newMsg = [];
    var now = (new Date().getTime() / 1000) - 30;
    for (var i in this.state.msgs) {
      var msg = this.state.msgs[i];
      if (now < msg.time) {
        newMsg.push(msg);
      }
    }

    this.state.msgs = newMsg;
    if (newMsg.length == 0) {
      this.state.visible = false;
    }
    this.forceUpdate();
  }

  componentDidMount() {
    this.timeId = setInterval(this.checkHide, 5000);
  }

  push(data) {
    this.state.msgs.push({
      time: parseInt(new Date().getTime() / 1000),
      show_time: new Date().Format("MM-dd hh:mm:ss "),
      info: data
    });
    this.setState({ visible: true });
  }

  render() {
    return (<div style={{ position: "fixed", right: "20px", bottom: "20px", zIndex: 9999 }}>
      <Alert color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
        {this.state.msgs.map(this.OneItem)}
      </Alert>
    </div>);
  }
}

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: this.loadConfig(),
      data: this.loadData(),
      currentEditIndex: -1
    };
    this.onConfigReady = this.onConfigReady.bind(this);

    this.onDataReady = this.onDataReady.bind(this);

    this.AddOneLine = this.AddOneLine.bind(this);
    this.edit = this.edit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.print = this.print.bind(this);

    this.editCommonInfo = this.editCommonInfo.bind(this);
    this.onChangeCommonInfo = this.onChangeCommonInfo.bind(this);

    this.timeId = null;

    this.save = this.save.bind(this);
    this.loadData = this.loadData.bind(this);
    this.loadConfig = this.loadConfig.bind(this);
    this.showMsg = this.showMsg.bind(this);

    this.mkNewData = this.mkNewData.bind(this);
  }


  loadData() {
    var data = localStorage.getItem("data");
    if (!data) {
      return defaultData;
    }
    return JSON.parse(data) || defaultData;
  }

  loadConfig() {
    var data = localStorage.getItem("config");
    if (!data) {
      return defaultConfig;
    }
    return JSON.parse(data) || defaultConfig;
  }

  componentDidMount() {
    this.timeId = setInterval(this.save, 60 * 5 * 1000);
  }

  componentWillUnmount() {
    if (this.timeId != null) {
      clearInterval(this.timeId);
      this.timeId = null;
    }
  }

  save() {
    localStorage.setItem("data", JSON.stringify(this.state.data));
    localStorage.setItem("config", JSON.stringify(this.state.config));
    this.refs["msg"].push("已保存到缓存");
  }

  AddOneLine() {
    var data = {};
    var out = this.state.config.fields.out_of_table;
    var inof = this.state.config.fields.in_table;
    for (var i in out) {
      data[out[i].key] = "";
    }
    for (var i in inof) {
      data[inof[i].key] = "";
    }

    console.log(i);
    this.state.data.fields.push(data);
    this.edit(this.state.data.fields.length - 1);
    //this.forceUpdate();
  }

  showMsg(data) {
    this.refs["msg"].push(data);
  }
  onConfigReady(config) {
    if (!config) {
      this.showMsg("文件错误");
      return;
    }
    console.log(config);
    this.setState({ config: config });
  }

  onDataReady(data) {
    if (!data) {
      this.showMsg("文件错误");
      return;
    }

    this.setState({ data: data });
  }


  edit(i) {
    this.setState({ currentEditIndex: i });
  }

  onChange(key, value, index) {
    this.state.data.fields[index][key] = value;
    this.forceUpdate();
  }

  onChangeCommonInfo(key, value) {
    this.state.data[key] = value;
    this.forceUpdate();
  }

  editCommonInfo() {
    this.setState({ currentEditIndex: -70 });
  }

  print() {
    this.save();
    var href = location.href;
    var hrefs = href.split("#");
    window.open(`${hrefs[0]}#print`)
  }
  mkNewData() {
    this.setState({
      data: {
        fields: [

        ]
      }
    });
  }
  render() {
    return (
      <MainBody fluid>
        <Row>
          <Col md={3}>
            <Config onReady={this.onConfigReady} />
          </Col>
          <Col md={3}>
            <DataReader onReady={this.onDataReady} />
          </Col>
        </Row>
        <div style={{ position: "fixed", bottom: 10, right: 10, zIndex: 999 }}>
          <DownloadMarkdown data={this.state.data} config={this.state.config} />
          <DownloadText data={this.state.data} config={this.state.config} />{" "}
          <Button outline color="success" onClick={this.print}>下载 PDF</Button>
          <Message ref="msg" />
          <DownloadDataBase data={this.state.data} /> {" "}
          <Button outline onClick={this.save}>保存缓存</Button> {" "}
          <Button outline color="danger" onClick={this.mkNewData}>新建</Button>
        </div>
        <Row>
          <Col md={6}>
            <div>
              <Preview data={this.state.data} config={this.state.config} onEdit={this.edit} onEditCommonInfo={this.editCommonInfo} />
              <Button outline onClick={this.AddOneLine}>添加一项</Button>
            </div>
          </Col>
          <Col md={6}>
            {
              this.state.currentEditIndex >= 0 && <EditPanel data={this.state.data.fields[this.state.currentEditIndex]} index={this.state.currentEditIndex} fields={this.state.config.fields} onChange={this.onChange} />
            }
            {this.state.currentEditIndex == -70 && <EditPanelCommon data={this.state.data} fields={this.state.config.info} onChange={this.onChangeCommonInfo} />}
          </Col>
        </Row>
      </MainBody>
    );
  }
}

class EditPanelCommon extends Component {
  constructor(props) {
    super(props);

    this.OneEdit = this.OneEdit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(key, value) {
    if (typeof this.props.onChange == "function") {
      this.props.onChange(key, value);
    }
  }

  OneEdit(d, index) {
    return <OneEditItem type={d.type} title={d.name} data={this.props.data[d.key]} onChange={this.onChange} key={index} kk={d.key} index={index} tips={d.tips || ""} />;
  }


  render() {
    return (
      <Form style={{ position: "fixed", top: 20, right: 20, width: "45%", height: "90%", overflow: "auto" }}>
        {this.props.fields.map(this.OneEdit)}
      </Form>
    );
  }
}

export class PrintPage extends Component {

  print() {
    window.print();
  }

  render() {
    console.log("print page")
    var data = JSON.parse(localStorage.getItem("data")) || defaultData;
    var config = JSON.parse(localStorage.getItem("config")) || defaultConfig;
    console.log(data, config);
    return (
      <MainBody>
        <Row>
          <Col md={12}>
            <Preview print data={data} config={config} />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="print-hide" style={{ position: "fixed", bottom: 10, right: 10, zIndex: 999 }}>
              <Button outline onClick={this.print}>确认保存</Button>
              <FormText>请在打开的窗口中选择[打印到 pdf 文件] 或其他类似选项。<br />注意：pdf 可能和预览略有出入</FormText>
            </div>
          </Col>
        </Row>
      </MainBody>
    );
  }
}

class DownloadDataBase extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var data = JSON.stringify(this.props.data);
    var time = new Date();
    var time_str = time.Format("yyyy-MM-dd_hh.mm.ss");

    return <span> {" "}<Button outline color="info" target="_blank" href={`data:text/plain;charset=utf-8;filename=edit_table_${time_str}.json,${encodeURI(data)}`} download={`edit_table_${time_str}.json`}>下载数据文件</Button></span>;
  }
}

class DownloadText extends Component {
  constructor(props) {
    super(props);

    this.text = "";
    this.appendInfo = this.appendInfo.bind(this);
    this.appendOutTable = this.appendOutTable.bind(this);
    this.appendInTable = this.appendInTable.bind(this);
    this.appendHr = this.appendHr.bind(this);
  }

  appendInfo(key_info) {
    this.text += this.parseText(key_info, this.props.data[key_info.key]) + "\r\n\r\n";
  }

  parseText(key_info, str) {
    return str || "";
  }

  appendOutTable(data, key_info) {
    console.log(arguments);
    this.text += this.parseText(key_info, data[key_info.key]) + "\r\n\r\n";
  }

  /*
| 项目 | 值 | 
| -: | - |
| Harry Potter | Gryffindor| 
| Hermione Granger | Gryffindor |
| Draco Malfoy | Slytherin |
  */
  appendInTable(data, key_info) {
    var result = data[key_info.key] || "";
    //result = result.replace(/\n/ig, "<br/>");
    //result = result.replace(/\r/ig, "");
    this.text += key_info.name + ":\r\n" + this.parseText(key_info, result) + "\r\n\r\n";
  }

  appendHr() {
    this.text += "\r\n--------------------\r\n\r\n";
  }

  render() {
    this.text = "";

    this.props.config.info.map(this.appendInfo);

    for (var i in this.props.data.fields) {
      var data = this.props.data.fields[i];
      this.props.config.fields.out_of_table.map(this.appendOutTable.bind(this, data));

      this.props.config.fields.in_table.map(this.appendInTable.bind(this, data));
      this.appendHr();
    }

    var time = new Date();
    var time_str = time.Format("yyyy-MM-dd_hh.mm.ss");

    return <span> {" "}<Button outline color="secondary" target="_blank" href={`data:text/plain;charset=utf-8;filename=edit_table_${time_str}.txt,${encodeURI(this.text)}`} download={`edit_table_${time_str}.txt`}>下载 Text</Button></span>;
  }
}

class DownloadMarkdown extends Component {
  constructor(props) {
    super(props);

    this.text = "";
    this.appendInfo = this.appendInfo.bind(this);
    this.appendOutTable = this.appendOutTable.bind(this);
    this.appendInTable = this.appendInTable.bind(this);
    this.appendHr = this.appendHr.bind(this);
  }

  appendInfo(key_info) {
    this.text += this.parseText(key_info, this.props.data[key_info.key]) + "\r\n";
  }

  parseText(key_info, str) {
    if (!str || str == "") {
      return "";
    }
    if (key_info.type == "tags") {
      var str2 = str.split(" ");
      var str3 = str2.join("` `");
      str3 = "`" + str3 + "`";
      return str3;
    }

    return (`${key_info.pre || ""}${str || ""}${key_info.ext || ""}`);
  }

  appendOutTable(data, key_info) {
    console.log(arguments);
    this.text += this.parseText(key_info, data[key_info.key]) + "\r\n";
  }

  /*
| 项目 | 值 | 
| -: | - |
| Harry Potter | Gryffindor| 
| Hermione Granger | Gryffindor |
| Draco Malfoy | Slytherin |
  */
  appendInTable(data, key_info) {
    var result = data[key_info.key] || "";
    result = result.replace(/\n/ig, "<br/>");
    result = result.replace(/\r/ig, "");
    this.text += `| ${key_info.name} | ` + this.parseText(key_info, result) + " |\r\n";
  }

  appendHr() {
    this.text += "----\r\n";
  }

  render() {
    this.text = "";

    this.props.config.info.map(this.appendInfo);

    this.text += "[toc]\r\n"

    for (var i in this.props.data.fields) {
      var data = this.props.data.fields[i];
      this.props.config.fields.out_of_table.map(this.appendOutTable.bind(this, data));

      if (this.props.config.fields.in_table.length > 0) {
        this.text += "| 项目 | 值 | \r\n | -: | - |\r\n";
      }

      this.props.config.fields.in_table.map(this.appendInTable.bind(this, data));
      this.appendHr();
    }

    var time = new Date();
    var time_str = time.Format("yyyy-MM-dd_hh.mm.ss");

    return <span> {" "}<Button outline color="primary" target="_blank" href={`data:text/plain;charset=utf-8;filename=edit_table_${time_str}.md,${encodeURI(this.text)}`} download={`edit_table_${time_str}.md`}>下载 Markdown</Button></span>;
  }
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/*
{
      key: "info",
    name: "简介",
    pre: "### ",
    type: "long"
  }
  
  */

class OneEditItem extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    if (typeof this.props.onChange == "function") {
      this.props.onChange(this.props.kk, e.target.value, this.props.index);
    }
  }

  render() {
    var tp = this.props.type == "long" ? "textarea" : "text";
    return (
      <InputGroupM title={this.props.title} tl={3}>
        <Input type={tp} value={this.props.data || ""} onChange={this.onChange} placeholder={this.props.tips} rows={5} />
      </InputGroupM>
    );
  }
}

class EditPanel extends Component {
  constructor(props) {
    super(props);
    this.OneEdit = this.OneEdit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(key, value, index) {
    if (typeof this.props.onChange == "function") {
      this.props.onChange(key, value, this.props.index);
    }
  }

  OneEdit(d, index) {
    return <OneEditItem type={d.type} title={d.name} data={this.props.data[d.key]} onChange={this.onChange} key={index} kk={d.key} index={index} tips={d.tips || ""} />;
  }

  render() {
    return (<Form style={{ position: "fixed", top: 20, right: 20, width: "45%", height: "90%", overflow: "auto" }}>
      {this.props.fields.out_of_table.map(this.OneEdit)}
      {this.props.fields.in_table.map(this.OneEdit)}
    </Form>);
  }
}

class ValueWithPreExt extends Component {
  setData() {
    var pre = this.props.pre || "";
    var ext = this.props.ext || "";
    var is_tag = this.props.type == "tags";

    if (is_tag) {
      return;
    }

    if (pre == "" && ext == "") {
      this.refs["info"].innerHTML = (this.props.data || "").replace(/\n/ig, "<br/>");
    } else {
      var data = `${pre}${this.props.data || ""}${ext} `;
      this.refs["info"].innerHTML = marked(data);
    }
  }

  componentDidUpdate() {
    this.setData();
  }

  componentDidMount() {
    this.setData();
  }
  //<Badge color="primary">Primary</Badge>
  OneTag(d, index) {
    return (
      <Badge color="primary" style={{ margin: "2px" }} key={index}>{d}</Badge>
    );
  }

  render() {
    var is_tag = this.props.type == "tags";
    var data = (this.props.data || "").split(" ");
    return <span ref="info">
      {is_tag && this.props.data && data.map(this.OneTag)}
    </span>;
  }
}

class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.info = this.info.bind(this);
    this.oneFiled = this.oneFiled.bind(this);
    this.oneLine = this.oneLine.bind(this);
    this.oneOutTable = this.oneOutTable.bind(this);
    this.edit = this.edit.bind(this);
    this.editCommonInfo = this.editCommonInfo.bind(this);
  }

  info(key_info, i) {
    return (
      <div key={i}>
        <ValueWithPreExt pre={key_info.pre} data={this.props.data[key_info.key]} ext={key_info.ext} />
      </div>
    );
  }

  oneOutTable(key_info, data_info, i) {
    return <div key={"out_" + i}>
      <ValueWithPreExt pre={key_info.pre} data={data_info[key_info.key] || key_info.name} ext={key_info.ext} type={key_info.type} />
    </div>;
  }

  oneFiled(key_info, data_info, i) {
    return <tr key={"table_" + i}>
      <td>{key_info.name}</td>
      <td><ValueWithPreExt pre={key_info.pre} data={data_info[key_info.key] || key_info.name} ext={key_info.ext} type={key_info.type} /></td>
    </tr>;
  }

  edit(i) {
    console.log(this.props.data.fields[i]);
    if (typeof this.props.onEdit == "function") {
      this.props.onEdit(i);
    }
  }

  editCommonInfo() {
    if (typeof this.props.onEditCommonInfo == "function") {
      this.props.onEditCommonInfo();
    }
  }

  oneLine(data_info, i) {
    return (
      <div key={i}>
        {!this.props.print && <Button color="link" onClick={this.edit.bind(this, i)}>[编辑本项目]</Button>}
        {this.props.config.fields.out_of_table.map((key_info, i) => this.oneOutTable(key_info, data_info, i))}
        <br />
        <Table bordered striped>
          <tbody>
            {this.props.config.fields.in_table.map((key_info, i) => this.oneFiled(key_info, data_info, i))}
          </tbody>
        </Table>
        <hr />
      </div>
    );
  }

  render() {
    return (
      <div>
        {!this.props.print && <Button color="link" onClick={this.editCommonInfo}>[编辑]</Button>}
        {this.props.config.info.map(this.info)}
        <hr />
        {
          this.props.data.fields.map(this.oneLine)
        }
      </div>
    );
  }
}


const defaultData = {
  title: "你好，世界",
  fields: [
    {
      addr: "http://baidu.com/api.json",
      name: "连接百度",
      info: "该 API 用于和百度通讯（请勿当真使用），这是瞎写的。\n换行测试"
    }
  ]
};

const defaultConfig = {
  title: "默认范例",
  description: "范例说明",
  info: [
    {
      key: "title",
      name: "大标题",
      type: "short",
      tips: "标题",
      pre: "# ",
      ext: ""
    }
  ],
  fields: {
    in_table: [
      {
        key: "name",
        name: "API 名称",
        type: "short",
        tips: "名称"
      },
      {
        key: "addr",
        name: "API 地址",
        type: "short",
        tips: "在这里输入地址"
      },
      {
        key: "tags",
        name: "标签",
        type: "tags",
        tips: "标签，以空格分隔"
      }
    ],
    out_of_table: [
      {
        key: "title",
        name: "名称",
        type: "short",
        pre: "### "
      },
      {
        key: "info",
        name: "简介",
        type: "long"
      }
    ]
  }
};
