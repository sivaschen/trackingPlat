import React from 'react'
import { Button, Icon, message, Popconfirm, Modal, Input } from 'antd'
import DeviceList from './../deviceList/deviceList.js'
import http from './../server'
import MyForm from './form'
import "./user.scss"




export default class User extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            eid: '',
            account: {},
            email: '',
            visible: false,
            confirmLoading: false,
            newUserName: '',
            newPwd: '',
            newAddr: '',
            newEmail: '',
            newPhone: ''
        }
    }
    componentDidMount () {
    	// 调用父组件方法把当前实例传给父组件
        this.props.onRef('user', this)
    }
    onRef = () => {
        this.props.onRef('user', this)
    }
    deleteSubAccount = () => {
        let eid = this.props.eid;
        const url = "/api"+"ent/deleteEnt"
        let data = {
            eid
        }
        http.get(url, data).then(res => {
            if (res.data.errcode === 0) {
                message.success("删除账户成功");
                this.props.loadTree('delete', this.state.account.eid);
            } else {
                message.error("删除失败");
            }
        })
    }
    addUser = () => {
        const url = "/api" + "ent/addEnt";
        let data = {
            pid: this.state.account.eid,
            login_name: this.state.newUserName,
            pwd: this.state.newPwd || "123456",
            phone:this.state.newPhone,
            addr:this.state.newAddr,
            email:this.state.newEmail        }
        http.get(url,data).then(res => {
            if (res.data.errcode === 0) {
                message.success("增加成功");
                let newNode = {
                    login_name: this.state.newUserName,
                    pwd: this.state.newPwd || "123456",
                    phone:this.state.newPhone,
                    addr:this.state.newAddr,
                    email:this.state.newEmail, 
                    key: 10000,
                    eid: 10000
                }
                this.props.loadTree('add', this.state.account.eid, newNode);
                this.setState({
                    visible: false
                })
            } else {
                message.error("增加用户失败");
            }
        })
    }
    getNewUserName = (e) => {
        this.setState({
            newUserName: e.target.value
        })
    }
    getNewPwd = (e) => {
        this.setState({
            newPwd: e.target.value
        })
    }
    getNewAddr= (e) => {
        this.setState({
            newAddr: e.target.value
        })
    }
    getNewPhone = (e) => {
        this.setState({
            newPhone: e.target.value
        })
    }
    getNewEmail = (e) => {
        this.setState({
            newEmail: e.target.value
        })
    }
    cancelAddUser = () => {
        this.setState({
            visible: false
        })
    }
    showAddUser = () => {
        this.setState({
            visible: true
        })
    }
    getDeviceList () {
        const url = "/apient/getSubDeviceInfo"
        let data = {
            eid: this.state.eid
        }
        http.get(url, data).then(res => {
            console.log(res)
        })
    }
    init = () => {
        let eid = this.props.eid;
        let url = "/apient/getEntInfoByEid";
        http.get(url, {eid: eid}).then((res) => {
        if (res.data.errcode === 0) {
            let data = res.data.data;
            this.setState({
                eid: String(eid),
                account: data
            }, () => {
                this.getDeviceList();
            })
        } else {
            message.error("获取账户信息失败");
        }
        })
    }

    render () {       
        return (
            <div className="user">
                <div className="accInfo">
                    <h3 className="accountTitle">账户信息:</h3>
                   <MyForm account={this.state.account}/>
                </div>
                <div className="userManage">
                    <Button onClick={this.showAddUser}><Icon type="user-add" />添加下级客户</Button>
                    <Popconfirm placement="top" title="删除当前账户" onConfirm={this.deleteSubAccount} okText="确定" cancelText="取消">
                        <Button><Icon type="user-delete" onClick={this.deleteSubAccount} />删除此用户</Button>
                    </Popconfirm>
                </div>
                <div className="deviceList">
                    <DeviceList eid={this.state.eid} />
                </div>
                <Modal title="添加用户" visible={this.state.visible} onOk={this.addUser} confirmLoading={this.confirmLoading} onCancel={this.cancelAddUser} className="addUser">
                    <Input addonBefore="登录名" className="addUserInput" onChange={this.getNewUserName}/>
                    <Input.Password addonBefore="密码" defaultValue="123456" className="addUserInput" onChange={this.getNewPwd} />
                    <Input addonBefore="电话" className="addUserInput" onChange={this.getNewPhone} />
                    <Input addonBefore="地址" className="addUserInput" onChange={this.getNewAddr} />
                    <Input addonBefore="Email" className="addUserInput" onChange={this.getNewEmail} />
                </Modal>
            </div>
        )
    }
}
