import React, { Component } from 'react';
import './monitor.scss'
import http from './../server.js'
import { Autocomplete, List, Dropdown, message,Icon, Modal, Select, Input, Button, Spin } from 'antd'
import {Link} from 'react-router-dom'

import car from './../../asset/images/car.png'
import tool from './../../asset/js/util.js'
import cmd from './cmd.js'
import {ComplexCustomOverlay} from './cutomOverlay.js'

const { Option } = Select;

const gps_status = {
  0: "未定位",
  1: "已定位"
};
const acc_status = {
  0: "关闭",
  1: "开启"
}
const dev_status = {
  offline: '离线',
  online: '在线'
}

export default class Monitor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deviceList: [],
      deviceId: '',
      location: {},
      timer: null,
      selectedMarker: null,
      markers: {},
      parsedAddress: '',
      cmdVisible: false,
      cmdList: [],
      selectedCmd: {},
      cmdInput: '',
      loading: false,
      cmdResponse: '',
      searchValue: '',
      searchDataSource: []
    }
  }
  init = () => {
    if (this.state.timer) {
      window.clearTimeout(this.state.timer);
    }
    this.getDeviceList();
  }
  componentWillUnmount () {
    if (this.state.timer) {
      window.clearTimeout(this.state.timer);      
    }
      let labelCmdDom = document.getElementsByClassName('labelCmd')[0];
      if (labelCmdDom) {
        labelCmdDom.removeEventListener("click", this.getCmdList);
      }
  }
  componentDidMount () {
    // 调用父组件方法把当前实例传给父组件
    this.props.onRef('monitor', this);
    this.getCurrrentLocation();
  }
  componentDidUpdate () {
    let labelCmdDom = document.getElementsByClassName('labelCmd')[0];
    if (labelCmdDom) {
      labelCmdDom.addEventListener("click", this.getCmdList);
    }
  }
  onRef = () => {
      this.props.onRef('monitor', this);
  }
  toPlayback = (e) => {
    let devid = this.state.deviceId;
    this.props.toPlayback(devid);
  }

  changeLabel = e => {
    let content = e.target.content;
    let point = e.target.getPosition();
    this.map.panTo(point);
    let heartTime = tool.formatTimestamp(content.heart_time || content.sys_time);
    let gpsTime = tool.formatTimestamp(content.gps_time);
    let str = '<span>速 度：'+content.speed+' km/h</span><br/><span>GPS：'+ gps_status[content.gps_status]+'</span><br/><span>ACC:'+ acc_status[content.acc_status] +'</span><br/><span>定位时间：'+ gpsTime +'</span><br/><span>心跳时间：'+ heartTime+'</span><br/>' + '<span>状态：'+ dev_status[content.dev_status] +'</span><br/>';
    if (content.dev_status === 'offline') {
      let offlineTime = this.formatTimeSpan(content.offline_time);
      str += '<span>离线时长：'+ offlineTime +'</span><br/>'
    }
    str +=  '<span class="labelCmd" data-type='+ content.product_type +'>指令</span>';
    let label = new window.BMap.Label(str, {
      offset: new window.BMap.Size(40, -65)
    })
    label.setStyle({
      fontSize : "12px",
      fontFamily:"微软雅黑",
      padding: '5px',
      borderColor: 'black',
      borderRadius: "5px"
    });
    let oldLabel = this.state.selectedMarker.getLabel();
    this.map.removeOverlay(oldLabel);
    e.target.setLabel(label);
    this.geoc.getLocation(point, rs => {
      var addComp = rs.addressComponents;
      this.setState({
        parsedAddress: addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber,
        selectedMarker: e.target,
        deviceId: content.devid
      })
    }) 
  }
  getLocationByAccount = (newAccount) => {
    let {deviceList} = this.state;
    const url =  "/ent/getRunInfoByEid";
    let data = {
      eid: this.props.eid,
      map_type: "baidu"
    }
    http.get(url, data).then(res => {
      if (res.data.errcode === 0) {
        let data = res.data.data;
        let { markers, selectedMarker } = this.state;
        for (let i = 0; i < data.length; i++) {          
          let item = data[i];
          for (let j = 0; j < deviceList.length; j++) {
            if (item.dev_id === deviceList[j].devid) {
              item.product_type = deviceList[i].product_type;
            }           
          }
          let point = new window.BMap.Point(item.longitude, item.latitude);
          let icon = new window.BMap.Icon(car, new window.BMap.Size(30,30));
          let marker = new window.BMap.Marker(point, {icon: icon});  // 创建标注
          marker.content = item;
          if (newAccount) {
            marker.setRotation(item.course);
            marker.addEventListener("click", this.changeLabel)
            markers[item.devid] = marker;
            this.map.addOverlay(marker);
          } else {
            markers[item.devid].setPosition(point);
            markers[item.devid].setRotation(item.course);    
            markers[item.devid].content = item;      
          }
          if (!this.state.selectedMarker) {
            if (this.props.devid && this.props.devid === item.devid) {
              selectedMarker = marker;
              this.map.panTo(point);
              this.updateLabel(marker);
              this.geoc.getLocation(point, (rs)=> {
                var addComp = rs.addressComponents;
                this.setState({
                  parsedAddress: addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber,
                  deviceId: item.devid
                })
              }); 
            } else if (!this.props.devid && i === 0) {
              selectedMarker = marker;
              this.map.panTo(point);
              this.updateLabel(marker);
              this.geoc.getLocation(point, (rs)=> {
                var addComp = rs.addressComponents;
                this.setState({
                  parsedAddress: addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber,
                  deviceId: item.devid
                })
              }); 
            }
          } else if (this.state.selectedMarker.content.devid === item.devid) {
            this.updateLabel(markers[item.devid]);
          }

          
        }
        let timer = setTimeout(() => {
          this.getLocationByAccount(false);
        }, 4000)
        this.setState({
          timer,
          selectedMarker,
          markers
        })
      }
    })
  }
  getDeviceList = () => {
    const url =  "/ent/getSubDeviceInfo"
    let data = {
        eid: this.props.eid
    }
    http.get(url, data).then(res => {
      if (res.data.errcode === 0) {
          this.setState({
            deviceList: res.data.data.records
          }, () => {
            if (this.map) {
              this.map.clearOverlays(); 
            }
            this.getLocationByAccount(true);
          })
        }
    })
  }
  formatTimeSpan = (time) => {
    let str = "";
    if ((time/(24*3600)) > 1) {
      str += parseInt(time / (24*3600)) + '天';
    }
    let hour = time % (24*3600);
    if ((hour/3600) > 1) {
      str += parseInt(hour / 3600) + '小时';
    }
    let minute = hour % 3600;
    if ((minute/60) > 1) {
      str += parseInt(minute / 60) + '分钟';
    }
    let second = minute % 60;
      str += parseInt(second) + '秒';
    return str
  }
  updateLabel = marker => {
    let content = marker.content;
    let heartTime = tool.formatTimestamp(content.heart_time || content.sys_time);
    let gpsTime = tool.formatTimestamp(content.gps_time);
    let point = marker.getPosition();
    let str = '<span>速 度：'+content.speed+' km/h</span><br/><span>GPS：'+ gps_status[content.gps_status]+'</span><br/><span>ACC:'+ acc_status[content.acc_status] +'</span><br/><span>定位时间：'+ gpsTime +'</span><br/><span>心跳时间：'+ heartTime+'</span><br/>' + '<span>状态：'+ dev_status[content.dev_status] +'</span><br/>';
    if (content.dev_status === 'offline') {
      let offlineTime = this.formatTimeSpan(content.offline_time);
      str += '<span>离线时长：'+ offlineTime +'</span><br/>'
    }
    str +=  '<span class="labelCmd" data-type='+ content.product_type +'>指令</span>';
    let label = marker.getLabel();
    if (label) {
      label.setContent(str);
    } else {
      let firstLabel = new window.BMap.Label(str, {
        offset: new window.BMap.Size(40, -65)
      })
      firstLabel.setStyle({
        fontSize : "12px",
        fontFamily:"微软雅黑",
        padding: '5px',
        borderColor: 'black',
        borderRadius: "5px"
      });
      marker.setLabel(firstLabel);
    }
    
    this.geoc.getLocation(point, rs => {
      var addComp = rs.addressComponents;
      this.setState({
        parsedAddress: addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber
      })
    })
  }
  handleCmdCancel = () => {
    this.setState({
      cmdVisible: false,
      cmdResponse: '',
      selectedCmd: {},
      cmdList: []
    })
  }
  handleCmdOK = () => {
    this.setState({
      cmdVisible: false,
      cmdResponse: '',
      selectedCmd: {},
      cmdList: []
    })
  }
  getLocation = () => {
    const url =  "/device/getRunInfoByDevid";
    let data = {
      dev_id: this.state.deviceId
    }
    http.get(url, data).then(res => {
      if (res.data.errcode === 0) {
        let data = res.data.data;
        let point = new window.BMap.Point(data.longitude, data.latitude);
        this.map.panTo(point);
        let marker2 = new window.BMap.Marker(point);  // 创建标注
	      this.map.addOverlay(marker2); 
      }
    })
  }
  getCmdList = (e) => {
    let product_type = e.target.getAttribute("data-type");
    const url =  "/device/getCmdListByType";
    let data = {
      product_type: product_type
    }
    http.get(url,data).then(res => {
      if(res.data.errcode === 0) {
        let customCmd = {
          cmd_id: 999,
          name: "透传",
          tw_name: "",
          en_name: "",
          pri: 9999,
          head: "",
          tail: "",
          check: "0",
          group: "1",
          remark: "VERSION#",
          param: "no param",
        }
        this.setState({
          cmdVisible: true,
          cmdList: res.data.data.concat([customCmd])
        })
      }
    })
  }
  getCurrrentLocation = () => {
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition((obj) => {
        this.setState({
          location:obj.coords
        }, () => {
          this.renderMap();
        })
      }, (error) => {
        switch(error.code)
        {
        case error.PERMISSION_DENIED:
          message.error("定位信息获取失败")
          break;
        case error.POSITION_UNAVAILABLE:
          message.error("定位信息获取失败")
          break;
        case error.TIMEOUT:
          message.error("定位信息获取失败")
          break;
        case error.UNKNOWN_ERROR:
          message.error("定位信息获取失败")
          break;
        default:
          break;
        }
        this.renderMap();
      }); 
    }
  }
  selectDevice = (devId) => {
    let {markers} = this.state;
    let marker = markers[devId];
    this.changeLabel({
      target: marker
    })
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
          url = "/device/searchByImei";
          data = {
              imei: searchText.trim()
          }
      } else {
          url = "/ent/searchEntByLName";   
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
  cmdChange = (value) => {
    this.state.cmdList.forEach(cmd => {
      if (cmd.cmd_id === value) {
        this.setState({
          selectedCmd: cmd
        })
      }
      
    })
  }
  renderInputCmd = () => {
    const { selectedCmd, cmdResponse } = this.state;
    let inputType = cmd[selectedCmd.cmd_id].type;
    let str;
    switch (inputType) {
      case 1:
        str = <Input className="cmdInput" onChange={this.getCmdInput}></Input>
        break;
      case 2:
        str = (<Select className="cmdInput" onChange={this.getCmdSelectInput} >
        {cmd[selectedCmd.cmd_id].option.map(option => {
          return <Option value={option.value} key={option.value}>{option.name}</Option>
        })}
      </Select>)
            break;
      default:
        break;
    }
    return (
      <div className="cmdContent">
        <span className="cmdName">{selectedCmd.name}</span>
          {str}
          <Button type="primary" onClick={this.sendCmd}>发送</Button>
          <div className="cmdResult"><span style={{fontWeight:'bolder'}}>指令结果：</span>{cmdResponse}</div>
      </div>
    )
  }
  getCmdInput = (e) => {
    this.setState({
      cmdInput: e.target.value
    })
  }
  getCmdSelectInput = (value) => {
    this.setState({
      cmdInput: value
    })
  }
  sendCmd = () => {
    const url =  "/device/sendCmd";
    const {cmdInput, selectedCmd, deviceId} = this.state; 
    let cmd_content =  selectedCmd.head + ((cmdInput && selectedCmd.sp) ? selectedCmd.sp:'') + cmdInput + selectedCmd.tail;
    let data = {
      dev_id: deviceId,
      cmd_id: selectedCmd.cmd_id,
      cmd_name: selectedCmd.name,
      cmd_content: cmd_content 
    }
    http.get(url, data).then(res => {
      if (res.data.errcode === 0) {
        message.success("指令已发送，请等待");
        this.setState({
          loading:true
        }, () => {
          this.getCmdResult(res.data.data.id, 0)
        })
      }
    })
  }
  customCover = () => {

  }
  getCmdResult = (id, count) => {
    const url =  "/device/getCmdRsp";
    let data = {
      id: id
    }
      http.get(url, data).then(res => {
          if (res.data.errcode === 0) {
            message.success("指令已执行。")
            this.setState({
              cmdResponse: res.data.data.response,
              loading: false
            })
          } else {
            count = count + 1;
            if (count === 10) {
              this.setState({
                loading:false
              })
              message.error(res.data.msg);
            } else {
              setTimeout(() => {
                this.getCmdResult(id, count)
              }, 1200);
            }
          }
        })    
  }
  renderMap = () => {
    this.map = new window.BMap.Map("map");
    this.map.centerAndZoom(new window.BMap.Point(this.state.location.longitude || 116.404, this.state.location.latitude ||39.915), 11); // 初始化地图,设置中心点坐标和地图级别
    this.map.addControl(new window.BMap.MapTypeControl()); //添加地图类型控件
    this.map.enableScrollWheelZoom();
    let navigationControl = new window.BMap.NavigationControl({
      // 靠左上角位置
      anchor: window.BMAP_ANCHOR_TOP_LEFT,
      // LARGE类型
      type: window.BMAP_NAVIGATION_CONTROL_LARGE,
      // 启用显示定位
      enableGeolocation: true
    });
    this.map.addControl(navigationControl);
    this.geoc = new window.BMap.Geocoder();  
    this.init(); 
  }
  render() {
  //   const deviceList = (
  //     <List size="small" header={<div className="deviceHeader">设备列表</div>} dataSource={this.state.deviceList}
  //     renderItem={item => <List.Item onClick={this.selectDevice.bind(this, item.dev_id)} className={ item.dev_id == this.state.deviceId ? "selected" :""}>
  //     {item.dev_name}
  //     
  //   </List.Item>}
  // style={{cursor:"pointer"}}
  //   />
  //     )
    const deviceList = (
      <ul>
        {this.state.deviceList.map(device => {
          return (<li onClick={this.selectDevice.bind(this, device.dev_id)} className={device.dev_id == this.state.deviceId ? " selected" :""}>
            <span className="name" >{device.dev_name}</span>
            <Link className="playback" to={{pathname: '/playback', search: ('devid=' + device.dev_id)}} target="_blank">回放</Link>
          </li>)
        })}
      </ul>
    );
    return (      
      <div className="monitor">          
        <div className="mapBox">
          <div className="parseAddress">{this.state.parsedAddress}</div>
          <div className="deviceList">
            <Dropdown overlay={deviceList}>
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                设备列表<Icon type="down" />
              </a>
            </Dropdown>
          </div>
          <div className="deviceSearch">
            <AutoComplete value={this.state.searchValue} dataSource={this.state.searchDataSource} style={{ width: 200 }} onSelect={this.onSearchSelect} onSearch={this.onSearch} onChange={this.onSearchChange} placeholder="请输入搜索的关键字"/>
          </div>
          <div id="map">
          </div>
        </div>
          <Modal title="发送指令" visible={this.state.cmdVisible} onOk={this.handleCmdOK} onCancel={this.handleCmdCancel}>
          <Spin spinning={this.state.loading} tip="获取指令结果">
              <Select onChange={this.cmdChange} style={{minWidth: "130px"}} placeholder="请选择指令">
                {this.state.cmdList.map((cmd, index) => {
                  return <Option value={cmd.cmd_id} key={cmd.cmd_id}>{cmd.name}</Option>
                })}
              </Select>
                {this.state.selectedCmd.cmd_id && this.renderInputCmd()} 

          </Spin>
          </Modal>

      </div>
    )
  }
}