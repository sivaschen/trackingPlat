import React, { Component } from 'react';
import { Input, Icon, Button } from 'antd';
import "./login.scss"
import http from "./../server"

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };
  loginSys = () => {
    http.get("https://5b5e71c98e9f160014b88cc9.mockapi.io/api/v1/lists").then(res => {
      this.props.history.push('/home');
    })
  };
  render() {
    return (
      <div className="loginBox">
        <div className="header">
          <img alt=""></img>
        </div>
        <div className="main">
          <div className="left">

          </div>
          <div className="loginInput">
            <h3>定位平台</h3>
            <Input addonBefore="账号" placeholder="请输入用户名" />
            <Input.Password addonBefore="密码" placeholder="请输入密码" className="password"/>
            <Button type="primary" onClick={this.loginSys}>登 录<Icon type="login" /></Button>
          </div>
        </div>
        <div className="copyright">

        </div>
      </div>
    )
  }
}