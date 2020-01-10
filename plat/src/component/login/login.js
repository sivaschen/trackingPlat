import React, { Component } from 'react';
import { Input, Icon } from 'antd';
import "./login.scss"

export default class Home extends Component {
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
            <Input addonBefore="账号" placeholder="请输入用户名" />
            <Input.Password addonBefore="密码" placeholder="请输入密码"/>
          </div>
        </div>
      </div>
    )
  }
}