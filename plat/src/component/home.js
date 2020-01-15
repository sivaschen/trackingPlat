import React, { Component } from 'react';
import {Switch, Route } from 'react-router-dom'
import Monitor from '../component/monitor/monitor'
import Trace from '../component/trace/trace'
import About from "./about"
import { Tree, Menu, Icon, Button } from 'antd';
import http from "./server"
import cookie from 'react-cookies'
import "./home.scss"

const { TreeNode } = Tree;
const {SubMenu} = Menu;
export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 'mail'
    }
  }
  componentWillMount() {
    
  }
  componentDidMount () {
    let url = "/apient/getEntInfoByEid?eid=10000"
    http.get(url).then(res => {
      console.log(res)
    })
  }
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };
  logout = () => {
    this.props.history.push("/login");
  }
  render() {
    return (
      <div className="home">
        <header>asdfasdfasdfasdfsaef <Button onClick={this.logout}>退 出</Button></header>
        <div className="menu">
        <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
          <Menu.Item key="mail">
            <Icon type="mail" />
            Navigation One
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
          <Tree showLine
          switcherIcon={<Icon type="down" />}
          defaultExpandedKeys={['0-0-0']}
          onSelect={this.onSelect}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="parent 1-0" key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" />
              <TreeNode title="leaf" key="0-0-0-1" />
              <TreeNode title="leaf" key="0-0-0-2" />
            </TreeNode>
            <TreeNode title="parent 1-1" key="0-0-1">
              <TreeNode title="leaf" key="0-0-1-0" />
            </TreeNode>
            <TreeNode title="parent 1-2" key="0-0-2">
              <TreeNode title="leaf" key="0-0-2-0" />
              <TreeNode title="leaf" key="0-0-2-1" />
            </TreeNode>
          </TreeNode>
        </Tree>
        </div>
        <div className="subPage">
          <Switch>
            <Route exact path="/home">
                <Monitor/>
            </Route>
            <Route path="/home/monitor">
                <Monitor/>
            </Route>
            <Route path="/home/trace">
                <Trace/>
            </Route>
            <Route path="/home/about">
                <About/>
            </Route>
        </Switch>
        </div>
      </div>
    )
  }
}


