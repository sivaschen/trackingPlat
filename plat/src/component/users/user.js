import React from 'react'
import { Button, Icon, message, Popconfirm, Modal,Tooltip, Input, AutoComplete, Select, Table, Upload } from 'antd'
import http from './../server'
import MyForm from './form'
import "./user.scss"
import UserTree from './tree'
const { Option } = Select;
const cardKey = {
    "iccid": "iccid",
    "msisdn": "msisdn",
    "package": "流量",
    "manufacturer": "制造商",
    "card_type": "卡类型",
    "card_status": "卡状态",
    "plat_start_time": "平台启用时间",
    "plat_expire_time": "平台过期时间",
    "create_time": "创建时间",
    "modify_time": "修改时间"
}
export default class User extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchImei: '',
            eid: '',
            account: {
                permission: '00'
            },
            cardVisible: false,
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
            ancestors: [],
            file: '',
            fileLogo: '',
            excelLoading: false,
            logoLoading: false,
            isRoot:false,
            cardInfo:  [],
            totalDeviceCnt: 0,
            dev_status: {},
            selectedDev: [],
            transferVisible:false,
            dev_status_stat: {
                offline: 0,
                online: 0
            },
            currentDevPage: 1,
            searchObj: {
                imei: '',
                page: 0
            }
        }
    }
    componentDidMount () {
        // 调用父组件方法把当前实例传给父组件
        
        this.props.onRef('user', this);
        let cookie = document.cookie.split(";");
        let cookieParms = {};
        let isRoot = false;
        cookie.forEach(item => {
            let objArr = item.split("=");
            cookieParms[objArr[0].trim()] = objArr[1];
        })
        let access_token = cookieParms.access_token;
        let eidLen = parseInt(access_token.substr(3, 2));
        let rootEid = access_token.substr(5, eidLen);
        if (rootEid == 8888 || rootEid == 10000) {
            isRoot = true;
        }
        this.setState({
            isRoot: isRoot,
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
                    title: '状态',
                    dataIndex: 'dev_status',
                    key: 'dev_status'
                },{
                    title: 'ICCID',
                    dataIndex: 'iccid',
                    key: 'iccid',
                    render:(text, record) => (
                        <div className="iccid" style={ !text ? {display: 'none'} : {} }>
                            <span>{text}</span>
                            <Icon onClick={this.showCardInfo.bind(this, text)} type="info-circle" />
                        </div>
                    )
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
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                  },{
                    title: '操作',
                    dataIndex: 'action',
                    key: 'action',
                    render: (text, record) => (
                        <span className="tableEdit">
                          <a onClick={this.changeRouter.bind(this, record.dev_id, "monitor")}>GPS</a>
                          <a onClick={this.changeRouter.bind(this, record.dev_id, 'bms')}>BMS</a>
                        </span>
                      )
                  }]
        }, () => {
            if (this.props.eid) {
                this.init({page: 0});
            }
        })
    }
    showCardInfo = (iccid) => {
        this.setState({
            cardVisible: true
        }, this.getCardInfo(iccid))
    }
    getCardInfo = (iccid) => {
        const url = "/ent/getCardInfoByIccid";
        let data = {
            iccid
        };
        http.get(url, data).then(res => {
            if (res.data.errcode === 0) {
                let cardInfo = res.data.data.card;
                let arr = [];
                for (const key in cardInfo) {
                    arr.push({
                        key: key,
                        value: cardInfo[key]
                    })
                }
                this.setState({
                    cardInfo: arr
                })
            } else {
                message.error("获取卡信息失败")
            }
        })
    }
    changeRouter = (devid, route) => {
        this.props.changeRouter(devid, route);
    }
    onRef = () => {
        this.props.onRef('user', this)
    }
    onSearchSelect = (value) => {
        let url, data;
        if (this.state.searchType === "device") {
            url = "/device/searchByImei";
            data = {
                imei: value
            }
        } else {
            url = "/ent/searchEntByLName";   
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
            url = "/device/searchImeiByPattern";
            data = {
                pattern: searchText.trim()
            }
        } else {
            url = "/ent/searchEntByLName";   
            data = {
                login_name: searchText
            }        
        }
        http.get(url, data).then(res => {
            if (res.data.errcode === 0) {
                if (this.state.searchType === 'account') {
                    this.setState({
                        searchDataSource: [res.data.data.login_name]
                    })
                } else {
                    this.setState({
                        searchDataSource: res.data.data
                    })
                }               
            } else {
                this.setState({
                    searchDataSource: []
                })
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
        const url = "/ent/deleteEnt"
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
        const url = "/ent/addEnt";
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

    getDeviceList (searchObj) {
        const url = "/ent/getSubDeviceInfo";
        let { eid } = this.state;
        let data = {
            eid: eid,
            pageno:searchObj.page
        }
        http.get(url, data).then(res => {
            let {dev_status } =  this.state;
            if (res.data.errcode === 0) {
                if (res.data.errcode === 0) {
                    let data = res.data.data;
                    for (let i = 0; i < data.records.length; i++) {
                        let status =  dev_status[data.records[i].dev_id]
                        data.records[i].dev_status = status ? status == 'offline' ? '离线' : "在线" : '';
                    }
                    this.setState({
                        deviceList: data.records,
                        totalDeviceCnt: data.total_cnt,
                        currentDevPage: searchObj.page + 1,
                        searchImei: searchObj.imei || ''
                    })
                }
            } else {
                message.error("获取设备列表失败");
            }
        })
    }

    customUploadExcel = () => {
        const url = "/ent/updateCardByFile";
        let data = new FormData();
        data.append("cardinfo", this.state.file);
        http.post(url, data).then(res => {
            console.log(res.data)
            if (res.data.errcode === 0) {
                message.success("上传成功");
            } else {
                message.error("上传失败");
            }
            this.setState({
                excelLoading: false
            })
        })
    }
    
    getFile = (file, filelist) => {
        this.setState({
            file,
            excelLoading: true
        });
        return true
    }
    saveAccInfo = () => {
        this.formPage.handleSubmit();
    }
    onRef = (name, ref) => {
        console.log(name);
        if (name === 'form') {
            this.formPage = ref;
        } else {
            this.treePage = ref;
        }
    }
    changeDevicePage = (page) => {
        let imei = this.state.searchObj.imei;
        this.getDeviceList({page: page -1, imei});
    }
    getDevStatus = (searchObj) => {
        const url = "/ent/getRunInfoByEid";
        let {eid} =  this.state;
        let dev_status_stat = {
            online: 0,
            offline: 0
        }
        http.get(url, {eid: eid}).then(res => {
            if (res.data.errcode === 0) {
                let data = res.data.data;
                let dev_status = {};
                for (let i = 0; i < data.length; i++) {
                    dev_status[data[i].devid] = data[i].dev_status;
                    if (data[i].dev_status == "offline") {
                        dev_status_stat.offline += 1;
                    } else {
                        dev_status_stat.online += 1;
                    }
                }
                this.setState({
                    dev_status,
                    dev_status_stat,
                }, () => {
                    this.getDeviceList(searchObj);
                })
            } else {
                this.setState({
                    dev_status_stat: {
                        online: 0,
                        offline: 0
                    }
                }, () => {
                    this.getDeviceList(searchObj);
                })
            }
        })
    }
    init = (searchObj) => {
        let eid = this.props.eid;
        let url = "/ent/getEntInfoByEid";
        http.get(url, {eid: eid}).then((res) => {
            if (res.data.errcode === 0) {
                let data = res.data.data;
                this.setState({
                    eid: String(eid),
                    account: data,
                    searchObj
                },
                () => {
                    this.getDevStatus(searchObj);
                })
            } else {                
                message.error("获取账户信息失败");   
                this.setState({
                    eid:String(eid),
                }, () => {
                    this.getDevStatus(searchObj);
                });             
            }
        }).catch(err => {
            console.log(err);
        })
    }
    transferDevs = () => {
        this.setState({
            transferVisible: true
        })
    }
    customUploadLogo = () => {
        const url = "/ent/uploadLogo";
        let {eid} = this.props;
        let data = new FormData();
        data.append("file_name", 'logo');
        data.append("eid", eid);
        data.append("file_logo", this.state.fileLogo);
        http.post(url, data).then(res => {
            if (res.data.errcode === 0) {
                message.success("上传Logo成功");
                this.init({page: 0});
            } else {
                message.error("上传Logo失败");
            }
            this.setState({
                logoLoading: false
            })
        })
      }
      reloadHomeTree = () => {
          this.props.reloadHomeTree();
      }
      getLogoFile = (file, filelist) => {
          this.setState({
              fileLogo: file,
              logoLoading: true
          })
          return true
      }
      rowClassName = (record, index) =>{
            if (record.imei === this.state.searchImei) {
                return 'selected'
            } else {
                return "normal"
            }
      }
   
    render () {       
        let { account, cardInfo, isRoot } = this.state;
        let permissionAcc = account;
        // bms_permission: "2"
        // sensor_permission: "1"
        // gps_permission: "1"
        let displayPermission = [];
        let controlPermission = [];
        if (permissionAcc.bms_permission === "2") {
            controlPermission.push('bms');
            displayPermission.push('bms');
        } else if (permissionAcc.bms_permission === "1") {
            displayPermission.push('bms');
        }
        if (permissionAcc.sensor_permission === "2") {
            controlPermission.push('sensor');
            displayPermission.push('sensor');
        } else if (permissionAcc.sensor_permission === "1") {
            displayPermission.push('sensor');
        }
        if (permissionAcc.gps_permission === "2") {
            controlPermission.push('gps');
            displayPermission.push('gps');
        } else if (permissionAcc.gps_permission === "1") {
            displayPermission.push('gps');
        }
        permissionAcc.displayPermission = displayPermission;
        permissionAcc.controlPermission = controlPermission;
        return (
            <div className="user">
                <div className="deviceSearch">
                    <h3 className="searchTitle">搜索:</h3>
                    <Select defaultValue="device" style={{ width: 120 }} onChange={this.searchTypeChange}>
                        <Option value="account">账户搜索</Option>
                        <Option value="device">设备搜索</Option>
                    </Select>
                    <AutoComplete value={this.state.searchValue} dataSource={this.state.searchDataSource} style={{ width: 200 }} onSelect={this.onSearchSelect} onSearch={this.onSearch} onChange={this.onSearchChange} placeholder="请输入搜索的关键字"/>
                    <span className="transferBtn" style={ isRoot ? {} : {display: 'none'}} onClick={this.transferDevs}>批量转移</span>
                </div>
                <div className="accInfo">
                    <h3 className="accountTitle">账户信息:</h3>
                    <div className="logo">
                        <img src={'http://'+this.state.account.logo_url} alt="#"/>
                        <div className="editUser">
                            <Button type="primary" className="saveAcc" onClick={this.saveAccInfo.bind(this)}>保存编辑</Button>
                            <Upload  className="logoUpload" name='cardinfo' beforeUpload={this.getLogoFile} customRequest={this.customUploadLogo} showUploadList={false}>
                                <Button style={ isRoot ? {} : {display: 'none'}} loading={this.state.logoLoading}>上传经销商Logo</Button>
                            </Upload>
                        </div>
                    </div>
                   <MyForm account={permissionAcc} rootAcc={this.props.rootAcc} onRef={this.onRef}/>
                   <div className="userManage">
                    <Button onClick={this.showAddUser} type="primary"><Icon type="user-add" />添加下级客户</Button>
                    <Popconfirm placement="top" title="删除当前账户" onConfirm={this.deleteSubAccount} okText="确定" cancelText="取消">
                        <Button type="danger"><Icon type="user-delete" onClick={this.deleteSubAccount} />删除当前用户</Button>
                    </Popconfirm>
                    </div>
                </div>
              
               
           
                <div className="deviceList">
                    <h3>
                        <span>设备列表</span>
                        <span className="onlineCnt">在线：{this.state.dev_status_stat.online}</span>
                        <span className="offlineCnt">离线：{this.state.dev_status_stat.offline}</span>
                        <div className="rootManage" >             
                            <Upload beforeUpload={this.getFile} name='cardinfo' onChange={this.uploadExcel} action="/api/ent/updateCardByFile" showUploadList={false} customRequest={this.customUploadExcel}>
                                
                                <i className="excelIcon"></i>
                                <Button loading={this.state.excelLoading}>
                                上传Excel
                                </Button>
                                <i className="excelIcon2"></i>
                                <a href="http://webbo.yunjiwulian.com/template/card.xls">
                                    下载Excel模板
                                    </a>
                            </Upload>
                        </div>
                    </h3>
                    <Table pagination={
                        {pageSize: 20, total: this.state.totalDeviceCnt, onChange: this.changeDevicePage, current: this.state.currentDevPage}
                    } columns={this.state.deviceColumns} dataSource={this.state.deviceList} rowKey="dev_id" rowClassName={this.rowClassName} />
                </div>
                <Modal title="添加用户" visible={this.state.visible} onOk={this.addUser} confirmLoading={this.confirmLoading} onCancel={this.cancelAddUser} className="addUser">
                    <Input addonBefore="登录名" className="addUserInput" onChange={this.getNewUserName}/>
                    <Input.Password addonBefore="密码" defaultValue="123456" className="addUserInput" onChange={this.getNewPwd} />
                    <Input addonBefore="电话" className="addUserInput" onChange={this.getNewPhone} />
                    <Input addonBefore="地址" className="addUserInput" onChange={this.getNewAddr} />
                    <Input addonBefore="Email" className="addUserInput" onChange={this.getNewEmail} />
                </Modal>
                <Modal  onOk={() => this.setState({cardVisible: false})} onCancel={() => this.setState({cardVisible: false})} className="cardModal" title="卡信息" visible={this.state.cardVisible} >
                    
                        {cardInfo.map(item => {
                            return (
                                <div className="cardTable">
                                    <span className="cardTitle">{cardKey[item.key] +':'}</span>
                                    <span className="cardValue">{item.value}</span>
                                </div>
                            )
                        })}
                    
                </Modal>
                <Modal destroyOnClose={true} onOk={() => this.setState({transferVisible: false})} onCancel={() => this.setState({transferVisible: false})} className="transferModal" title="批量转移" visible={this.state.transferVisible}>
                            <UserTree reloadHomeTree={this.reloadHomeTree} eid={this.state.eid} onRef={this.onRef} />
                </Modal>
            </div>
        )
    }
}
