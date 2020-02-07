import React from 'react'
import { Button, Icon, message, Popconfirm, Modal, Input, AutoComplete, Select, Table,Divider } from 'antd'
import http from './../server'
import MyForm from './form'
import "./user.scss"
const { Option } = Select;

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
            newPhone: '',
            searchValue: '',
            searchDataSource: [],
            searchType: 'device',
            deviceList: [],
            deviceColumns: [],
            ancestors: []
        }
    }
    componentDidMount () {
        // 调用父组件方法把当前实例传给父组件
        
        this.props.onRef('user', this);
        this.setState({
            deviceColumns: [
                {
                    title: '设备名',
                    dataIndex: 'dev_name',
                    key: 'dev_name',
                  },
                {
                    title: 'IMEI',
                    dataIndex: 'imei',
                    key: 'imei'
                },{
                    title: 'Msisdn',
                    dataIndex: 'msisdn',
                    key: 'msisdn'
                },
                  {
                    title: '设备型号',
                    dataIndex: 'product_type',
                    key: 'product_type',
                  },{
                    title: '导入时间',
                    dataIndex: 'CREATE_TIME',
                    key: 'CREATE_TIME',
                  },{
                    title: '车牌号',
                    dataIndex: 'plateno',
                    key: 'plateno',
                  }
                  ,{
                    title: '操作',
                    dataIndex: 'action',
                    key: 'action',
                    render: (text, record) => (
                        <span>
                          <a>跟踪</a>
                          <Divider type="vertical" />
                          <a onClick={this.monitorDevice.bind(this, record.dev_id)}>监控</a>
                        </span>
                      )
                  }]
        }, () => {
        if (this.props.eid) {
            this.init();
        }
        })
    }

    monitorDevice = (devid) => {
        this.props.monitorDevice(devid);
    }
    onRef = () => {
        this.props.onRef('user', this)
    }
    onSearchSelect = (value) => {
        let url, data;
        if (this.state.searchType === "device") {
            url = "/api" + "/device/searchByImei";
            data = {
                imei: value
            }
        } else {
            url = "/api" + "/ent/searchEntByLName";   
            data = {
                login_name: value
            }        
        }
        http.get(url, data).then(res => {
            if (res.data.errcode === 0) {
                this.props.expandAncestors(res.data.data);
            }
        });
    }
    onSearch = searchText => {
        let url, data;
        if (this.state.searchType === "device") {
            url = "/api" + "/device/searchByImei";
            data = {
                imei: searchText.trim()
            }
        } else {
            url = "/api" + "/ent/searchEntByLName";   
            data = {
                login_name: searchText
            }        
        }
        http.get(url, data).then(res => {
            if (res.data.errcode === 0) {
                console.log(res.data.data.imei)
                if (this.state.searchType === 'account') {
                    this.setState({
                        searchDataSource: [res.data.data.login_name]
                    })
                } else {
                    this.setState({
                        searchDataSource: [res.data.data.imei]
                    })
                }
                
                
            }
        });
    }
    onSearchChange = value => {
        this.setState({
            searchValue: value
        })
    }
    searchTypeChange = value => {
        this.setState({
            searchType: value
        })
    }
    deleteSubAccount = () => {
        let eid = this.props.eid;
        const url = "/api" + "/ent/deleteEnt"
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
        const url = "/api" + "/ent/addEnt";
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
        const url = "/api" + "/ent/getSubDeviceInfo"
        let data = {
            eid: this.state.eid
        }
        http.get(url, data).then(res => {
            if (res.data.errcode === 0) {
                if (res.data.errcode === 0) {
                    this.setState({
                        deviceList: res.data.data.records
                    })
                }
            } else {
                message.error("获取设备列表失败");
            }
        })
    }
    init = () => {
        let eid = this.props.eid;
        let url = "/api" + "/ent/getEntInfoByEid";
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
        console.log('aaaaa')

            message.error("获取账户信息失败");
        }
        })
    }
    render () {       
        return (
            <div className="user">
                <div className="deviceSearch">
                    <h3 className="searchTitle">搜索:</h3>
                    <Select defaultValue="device" style={{ width: 120 }} onChange={this.searchTypeChange}>
                        <Option value="account">账户搜索</Option>
                        <Option value="device">设备搜索</Option>
                    </Select>
                    <AutoComplete value={this.state.searchValue} dataSource={this.state.searchDataSource} style={{ width: 200 }} onSelect={this.onSearchSelect} onSearch={this.onSearch} onChange={this.onSearchChange} placeholder="请输入搜索的关键字"/>
                </div>
                <div className="accInfo">
                    <h3 className="accountTitle">账户信息:</h3>
                   <MyForm account={this.state.account}/>
                </div>
                <div className="userManage">
                    <Button onClick={this.showAddUser} type="primary"><Icon type="user-add" />添加下级客户</Button>
                    <Popconfirm placement="top" title="删除当前账户" onConfirm={this.deleteSubAccount} okText="确定" cancelText="取消">
                        <Button type="danger"><Icon type="user-delete" onClick={this.deleteSubAccount} />删除当前用户</Button>
                    </Popconfirm>
                </div>
                <div className="deviceList">
                    <h3>设备列表</h3>
                    <Table columns={this.state.deviceColumns} dataSource={this.state.deviceList} rowKey="dev_id" />
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
