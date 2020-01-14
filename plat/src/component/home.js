import React, { Component } from 'react';
import {Switch, Route } from 'react-router-dom'
import Monitor from '../component/monitor/monitor'
import Trace from '../component/trace/trace'
import About from "./about"
import { Tree, Menu, Icon, Button } from 'antd';
import "./home.scss"

const { TreeNode } = Tree;
const {SubMenu} = Menu;

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false
    }
  }
  componentDidMount() {
  }
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  render() {
    return (
      <div className="home">
        <header>asdfasdfasdfasdfsaef</header>
        <div className="menu">
          <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode="horizontal" theme="dark"
            inlineCollapsed={this.state.collapsed} style={{paddingLeft: 200}}>
            <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span>Option 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="desktop" />
              <span>Option 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="inbox" />
              <span>Option 3</span>
            </Menu.Item>
            <SubMenu key="sub1"
              title={
                <span>
                  <Icon type="mail" />
                  <span>Navigation One</span>
                </span>
              }
            >
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2"
              title={
                <span>
                  <Icon type="appstore" />
                  <span>Navigation Two</span>
                </span>
              }
            >
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
              </SubMenu>
            </SubMenu>
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


