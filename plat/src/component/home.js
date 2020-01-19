import React, { Component } from 'react';
import {Switch, Route } from 'react-router-dom'
import Monitor from '../component/monitor/monitor'
import Trace from '../component/trace/trace'
import User from './users/user'
import { Tree, Menu, Icon, Button, message } from 'antd';
import http from "./server"
import "./home.scss"

const { TreeNode } = Tree;
const {SubMenu} = Menu;

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eid: '',
      treeData: [],
      expandedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],  
      account: {
        login_name: ''
      }
    }
  }
  componentDidMount () {
    this.getToken();
  }
  getToken = () => {
    let cookie = document.cookie.split(";");
    let cookieParms = {}
    cookie.forEach(item => {
      let objArr = item.split("=");
      cookieParms[objArr[0].trim()] = objArr[1];
    })
    let access_token = cookieParms.access_token;
    let eidLen = parseInt(access_token.substr(3, 2));
    let eid = access_token.substr(5, eidLen);
    let url = "/apient/getEntInfoByEid";
    http.get(url, {eid: eid}).then((res) => {
      if (res.data.errcode === 0) {
        let data = res.data.data;
        this.setState({
          eid: String(eid),
          account: data
        })
        this.getSubAcc(String(eid)).then(res => {
          if (res) {
            this.setState({
              treeData: res,
              expandedKeys: [String(eid)],
              selectedKeys: [String(eid)]
            })
            this.user.init();
          }
        })
      } else {
        message.error("获取账户信息失败");
      }
    })
  }
  onLoadData = treeNode =>
  new Promise(async(resolve) => {
    if (treeNode.props.children) {
      resolve();
      return;
    }
    this.getSubAcc(treeNode.props.eid).then(res => {
      if (res) {
        treeNode.props.dataRef.children = res
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve();

      }
    });
  });
    
  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    if (!info.selected) return
    this.setState({ selectedKeys });
    this.user.init();
  };
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
  });
  getSubAcc = (eid) => {
    let url = "/apient/getEntChildrenByEid";
    return http.get(url, {eid: eid}).then(res => {
      if (res.data.errcode === 0) {
        let data = res.data.data;
        let newRecords = [];
        let rootNode = {}
        if (eid === this.state.eid) {
          rootNode = {
            eid: data.eid,
            title: data.text,
            pid: data.pid,
            key: data.eid,
            isLeaf: data.leaf
          }
          
        }
        data.records.forEach(item => {
          newRecords.push({
            eid: item.eid,
            pid: item.pid,
            title: item.text,
            isLeaf: item.leaf,
            key: String(item.eid)
          })
        })
        if (eid === this.state.eid) {
          rootNode.children = newRecords;
          return [rootNode]
        }
        return newRecords
      } else {
        message.error("获取下级用户失败")
      }
    })
  }
  rightClickNode = (node) => {

  }
  onRef = (name, ref) => {
    switch (name) {
        case 'chatWindow':
            this.chatWindow = ref
            break
        case 'user':
            this.user = ref
            break
        default:
            break
    }
  }
  logout = () => {
    this.props.history.push("/login");
  }
  render() {
    return (
      <div className="home">
        <header>
          <Button onClick={this.logout} type="danger">退 出</Button>
          <span className="name">{"登陆账户：" + this.state.account.login_name}</span>
        </header>
        <div className="menu">
          <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
            <Menu.Item key="user">
              <Icon type="team"/>
              客户管理
            </Menu.Item>
            <Menu.Item key="app" disabled>
              <Icon type="appstore" />
              Navigation Two
            </Menu.Item>
            <SubMenu
              title={
                <span className="submenu-title-wrapper">
                  <Icon type="setting" />
                  Navigation Three - Submenu
                </span>
              }
            >
              <Menu.ItemGroup title="Item 1">
                <Menu.Item key="setting:1">Option 1</Menu.Item>
                <Menu.Item key="setting:2">Option 2</Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup title="Item 2">
                <Menu.Item key="setting:3">Option 3</Menu.Item>
                <Menu.Item key="setting:4">Option 4</Menu.Item>
              </Menu.ItemGroup>
            </SubMenu>
            <Menu.Item key="alipay">
              <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                Navigation Four - Link
              </a>
            </Menu.Item>
          </Menu>
        </div>     
        <div className="tree">
          <Tree loadData={this.onLoadData} 
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeys}
            onRightClick={this.rightClickNode}>
              {this.renderTreeNodes(this.state.treeData)}
          </Tree>
        </div>
        <div className="subPage">
          <Switch>
            <Route exact path="/home">
                <User eid={ this.state.selectedKeys[0]} onRef={this.onRef.bind(this)} />
            </Route>
            <Route path="/home/monitor">
                <Monitor/>
            </Route>
            <Route path="/home/trace">
                <Trace/>
            </Route>
        </Switch>
        </div>
      </div>
    )
  }
}


