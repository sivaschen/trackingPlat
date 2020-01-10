import React, { Component } from 'react';
import { Input } from 'antd';

export default class Home extends Component {
  render() {
    return (
      <div className="login">
        <div className="header">
          <img alt=""></img>
        </div>
        <div className="main">
          <div className="left">

          </div>
          <div className="loginBox">
            <Input placeholder="Basic usage" />
          </div>
        </div>
      </div>
    )
  }
}