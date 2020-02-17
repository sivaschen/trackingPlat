import React, { Component } from 'react';
import {Switch, Route, NavLink } from 'react-router-dom'
import Monitor from '../component/monitor/monitor'
import Trace from '../component/trace/trace'
import YJCenter from '../component/yjcenter/yjcenter'
import Bms from './bms/bms.js'
import User from './users/user'
import { Tree, Menu, Icon, Button, message } from 'antd';
import http from "./server"
import "./home.scss"
import Logo from './../asset/images/logo.jpg'

const { TreeNode } = Tree;

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: '/home/user',
      eid: '',
      devid: '',
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
    this.props.history.listen(()=>{
      if (this.props.history.location.pathname === "/home/user") {
        
      }
    })
    this.setState({
      current: this.props.history.location.pathname
    }, () => {
      this.getToken();
    })
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
    if (eid == 8888) {
      eid = 10000
    }
    let url = "http://webbo.yunjiwulian.com" + "/ent/getEntInfoByEid";
    http.get(url, {eid: eid}).then((res) => {
      if (res.data.errcode === 0) {
        let data = res.data.data;
        this.setState({
          eid: String(eid),
          account: data
        }, () => {
          this.getSubAcc(String(eid)).then(res => {
            if (res) {
              this.setState({
                treeData: res,
                expandedKeys: [String(eid)],
                selectedKeys: [String(eid)]
              }, () => {
                this.subpage.init();
              })              
            }
          })
        })
        
      } else {
        message.error("获取账户信息失败");
      }
    })
  }
  onLoadData = treeNode =>
  new Promise((resolve) => {
    console.log(treeNode);
    if (treeNode.props.children) {
      resolve();
      return;
    }
    this.getSubAcc(treeNode.props.eid).then(res => {
      if (res) {
        treeNode.props.dataRef.children = res
        this.setState({
          treeData: [...this.state.treeData],
        }, ()=>{
          resolve();
        });
      }
    });
  });
  updateTreeNode = async(type, eid, newNode) => {
    let { treeData } = this.state;
    const getSubAcc = this.getSubAcc;        
    let searchNode = async(type, arr, eid) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].eid === eid) {
          if (type === 'delete') {
            arr.splice(i, 1);
          } else {
              let children = await getSubAcc(eid);  
              arr[i].isLeaf = false;            
              arr[i].children = children;
              this.setState({
                treeData: treeData,
                expandedKeys: [String(eid)]
              })
          }
          return
        } 
        if (arr[i].children) {
          searchNode(type, arr[i].children, eid)
        }   
      }
    }
    await searchNode(type,treeData, eid);
    if (type === 'delete') {
      this.setState({
        treeData: treeData
      })
    } else {
      
    }


  }
  onExpand = expandedKeys => {
    console.log(expandedKeys)
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };
  loadTree = (keys, obj) => {
    console.log(keys);
    console.log(obj)
  }
  onSelect = (selectedKeys, info) => {
    if (!info.selected) return
    this.setState({ selectedKeys, devid: '' }, () => {
      this.subpage.init();
    });
    
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
    let url = "http://webbo.yunjiwulian.com" + "/ent/getEntChildrenByEid";
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
  onRef = (name, ref) => {
    this.subpage = ref;
  }
  handleMenuClick = e => {
    this.setState({
      current: e.key,
    });
  }
  // 90uuuou
  expandAncestors = async(data) => {
    let { treeData } = this.state;
    let ancestors = data.ancestors;    
    let children = treeData;
    let keys = [];
    for (let j = 0; j < ancestors.length; j++) {
      keys.push(String(ancestors[j].eid));
      for (let i = 0; i < children.length; i++) {
        if (ancestors[j].eid === children[i].eid) {
          if (children[i].children) {
            children = children[i].children;
          } else {
              children[i].children = await this.getSubAcc(children[i].eid);
              children = children[i].children; 
            }
          break;
        }        
      }
    }
    this.setState({
        treeData: treeData,
        expandedKeys: keys,
        selectedKeys: [String(ancestors[ancestors.length - 1].eid)]
    }, () => {
      this.subpage.init();
    })
  }
  monitorDevice = (devid) => {
    this.setState({
      devid: devid,
      current: "/home/monitor"
    }, () => {
      this.props.history.push("/home/monitor")
    })
  }
  logout = () => {
    this.props.history.push("/login");
  }
  bmsNoPerm = () => {
    this.props.history.push("/home/user")
  }
  render() {
    return (
      <div className="home">
        <header>
          {/* <img src={Logo}/> */}
          <Button onClick={this.logout} type="danger">退 出</Button>
          <span className="name">{"登陆账户：" + this.state.account.login_name}</span>
        </header>
        <div className="menu">
          <Menu onClick={this.handleMenuClick} selectedKeys={[this.state.current]} mode="horizontal" >
            <Menu.Item key="/home/user">              
              <NavLink to="/home/user"><Icon type="team"/>客户管理</NavLink>
            </Menu.Item>
            <Menu.Item key="/home/monitor">              
              <NavLink to="/home/monitor"><Icon type="environment" />监控</NavLink>              
            </Menu.Item>
            <Menu.Item key="/home/bms" style={this.state.account.permission > 0 ? {display: 'inline-block'}: {display: 'none'}}>              
              <NavLink to="/home/bms"><Icon type="api" />电池管理</NavLink>              
            </Menu.Item>
          </Menu>
        </div>     
        <div className="tree">
          <Tree loadData={this.onLoadData} 
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onSelect={this.onSelect}
            onLoad={this.loadTree}
            selectedKeys={this.state.selectedKeys}
            onRightClick={this.rightClickNode}>
              {this.renderTreeNodes(this.state.treeData)}
          </Tree>
        </div>
        <div className="subPage">
          <Switch>
            <Route exact path="/home">
                <User addNode={this.addNodeCallback} eid={this.state.selectedKeys[0]} onRef={this.onRef.bind(this)} loadTree={this.updateTreeNode} monitorDevice={this.monitorDevice} expandAncestors={this.expandAncestors} />
            </Route>
            <Route path="/home/monitor">
                <Monitor onRef={this.onRef.bind(this)} eid={this.state.selectedKeys[0]} devid={this.state.devid} />
            </Route>
            <Route path="/home/trace">
                <Trace/>
            </Route>
            <Route path="/home/yjcenter">
                <YJCenter onRef={this.onRef.bind(this)} eid={this.state.selectedKeys[0]}/>
            </Route>
            <Route path="/home/bms">
                <Bms eid={this.state.selectedKeys[0]} onRef={this.onRef.bind(this)} permission={Number(this.state.account.permission)} bmsNoPerm={this.bmsNoPerm} />
            </Route>
            <Route path="/home/user">
                <User addNode={this.addNodeCallback} eid={this.state.selectedKeys[0]} onRef={this.onRef.bind(this)} loadTree={this.updateTreeNode} monitorDevice={this.monitorDevice} expandAncestors={this.expandAncestors} />
            </Route>
        </Switch>
        </div>
      </div>
    )
  }
}


