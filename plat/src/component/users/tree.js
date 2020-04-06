import React from 'react'
import { Tree, message,Input, Button } from 'antd'
import http from './../server'
const { TreeNode } = Tree;

const { TextArea } = Input;

export default class UserTree extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            treeData: [],
            expandedKeys: [],
            imeis: ''
        }
    }
    componentDidMount() {
        let cookie = document.cookie.split(";");
        let cookieParms = {}
        cookie.forEach(item => {
        let objArr = item.split("=");
        cookieParms[objArr[0].trim()] = objArr[1];
        })
        let access_token = cookieParms.access_token;
        let eidLen = parseInt(access_token.substr(3, 2));
        let eid = access_token.substr(5, eidLen);
        this.setState({
            eid
        }, ()=> {
            this.getTree(eid);
        })
    }
    transferImeis = () => {
        let {imeis, selectedKeys} = this.state;
        const url = "/device/transferDevices";
        console.log(selectedKeys);
        let data = {
            target_eid: selectedKeys[0],
            imeis:imeis
        }
        http.get(url, data).then(res => {
            if(res.data.errcode=== 0){
                message.success("转移成功");
                this.props.reloadHomeTree();
                this.getTree(this.state.eid);
            } else {
                message.error('转移失败');
            }
        })
    }
    getTree = (eid) => {
        this.getSubAcc(eid).then(res => {
            if (res) {
                this.setState({
                  treeData: res,
                  expandedKeys: [String(eid)],
                  selectedKeys: [String(eid)],
                })              
              }
        })
    }
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
    onLoadData = treeNode =>
        new Promise((resolve) => {
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
    onExpand = expandedKeys => {
        this.setState({
        expandedKeys,
        autoExpandParent: false,
        });
    };
    onSelect = (selectedKeys, info) => {
        if (!info.selected) return
        this.setState({ selectedKeys});    
    };
    getSubAcc = (eid) => {    
        let url =  "/ent/getEntChildrenByEid";
        return http.get(url, {eid: eid}).then(res => {
          if (res.data.errcode === 0) {
            let data = res.data.data;
            let newRecords = [];
            let rootNode = {};
            if (eid == this.state.eid) {
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
      getImies = (e) => {
        this.setState({
            imeis: e.target.value
        })
    }
    render () {
        
        return (
            <div className="transferModal">
                <div className="transferTree">                    
                    <Tree loadData={this.onLoadData} 
                        onExpand={this.onExpand}
                        expandedKeys={this.state.expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        onSelect={this.onSelect}
                        onLoad={this.loadTree}
                        selectedKeys={this.state.selectedKeys}
                        >
                        {this.renderTreeNodes(this.state.treeData)}
                    </Tree>
                </div>
                <TextArea value={this.state.imeis} onChange={this.getImies} className="imeis" placeholder="请输入imei号" rows={4} />
                <Button className="transferAction" type="primary" onClick={this.transferImeis}>转移</Button>
            </div>
        )
    }
}

