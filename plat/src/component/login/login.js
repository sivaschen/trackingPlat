import React, { Component } from 'react';
import { Input, Icon, Button, message  } from 'antd';
import "./login.scss"
import http from "./../server"
import md5 from 'md5'
import WarpAni from './warp.js'
import Logo from './../../asset/images/logo.jpg'

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      pwd: ""
    }
  };
  setUserName = (e) => {
    this.setState({
      userName: e.target.value
    })
  }
  componentDidMount () {
    this.addEnterEvent();
  }
  setPwd = (e) => {
    this.setState({
      pwd: e.target.value
    })
  }
  
  loginSys = () => {
    const {userName, pwd} = this.state;
    if (!userName || !pwd) {
      message.warning("请输入用户名和密码");
      return
    }
    let time = Math.floor(new Date().getTime() / 1000);
    let url =  "/login/loginByEnt?login_name=" + userName + "&time=" + time + "&signature=" + md5(md5(pwd) + time)
    http.post(url).then(res => {
      if (res.data.errcode === 0) {
        let targetUrl = res.data.data.url;
        this.props.history.push(targetUrl);
      } else if (res.data.errcode === 3) {
        message.error('密码错误');
      }
    })
  };
  componentWillUnmount () {
    document.body.removeEventListener('keyup', this.loginWithEnter)
  }
  loginWithEnter = (e) => {
      if (e.keyCode === 13) {
        this.loginSys();
      }
  }
  addEnterEvent = () => {
    document.body.addEventListener("keyup", this.loginWithEnter);
  }
  render() {
    return (
      <div className="loginBox">
        <header>
          <span className="platform">智慧能源大数据平台</span>
        </header>
          <WarpAni className="warpDrive"/>
          <div className="loginInput">
            {/* <h3>云集智能锂电系统</h3> */}
            <Input addonBefore="账号" placeholder="请输入用户名" value={this.state.userName} onChange={this.setUserName}/>
            <Input.Password addonBefore="密码" placeholder="请输入密码" className="password" value={this.state.pwd} onChange={this.setPwd.bind(this)}/>
            <Button type="primary" onClick={this.loginSys}>登 录<Icon type="login" /></Button>
          </div>
        <div className="copyright">

        </div>
      </div>
    )
  }
}  
