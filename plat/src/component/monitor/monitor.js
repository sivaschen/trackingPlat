import React, { Component } from 'react';
import './monitor.scss'
import http from './../server.js'
import { List, message, Modal, Select, Input, Button } from 'antd'
import car from './../../asset/images/car.png'
import tool from './../../asset/js/util.js'
import cmd from './cmd.js'

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
      cmdInput: ''
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
    str +=  '<a class="labelCmd">指令</a>';
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
    const url = "/api" + "/ent/getRunInfoByEid";
    let data = {
      eid: this.props.eid
    }
    http.get(url, data).then(res => {
      if (res.data.errcode === 0) {
        let data = res.data.data;
        let { markers, selectedMarker } = this.state;
        for (let i = 0; i < data.length; i++) {          
          let item = data[i];
          let point = new window.BMap.Point(item.longitude / 1000000, item.latitude / 1000000);
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
    const url = "/api" + "/ent/getSubDeviceInfo"
    let data = {
        eid: this.props.eid
    }
    http.get(url, data).then(res => {
      if (res.data.errcode === 0) {
          this.setState({
            deviceList: res.data.data.records
          }, () => {
            this.map.clearOverlays(); 
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
    str +=  '<a class="labelCmd">指令</a>'
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
      cmdVisible: false
    })
  }
  handleCmdOK = () => {
    this.setState({
      cmdVisible: false
    })
  }
  getLocation = () => {
    const url = "/api" + "/device/getRunInfoByDevid";
    let data = {
      dev_id: this.state.deviceId
    }
    http.get(url, data).then(res => {
      if (res.data.errcode === 0) {
        let data = res.data.data;
        let point = new window.BMap.Point(data.longitude / 1000000, data.latitude / 1000000);
        this.map.panTo(point);
        let marker2 = new window.BMap.Marker(point);  // 创建标注
	      this.map.addOverlay(marker2); 
      }
    })
  }
  getCmdList = () => {
    const url = "/api" + "/device/getCmdListByType";
    let data = {
      product_type: "yj03"
    }
    http.get(url,data).then(res => {
      console.log(res)
      if(res.data.errcode === 0) {
        this.setState({
          cmdVisible: true,
          cmdList: res.data.data
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
    const { selectedCmd } = this.state;
    let inputType = cmd[selectedCmd.cmd_id].type;
    let str;
    switch (inputType) {
      case 1:
        str = <Input className="cmdInput" onChange={this.getCmdInput}></Input>
        break;
      case 2:
        str = (<Select className="cmdInput" onChange={this.getCmdSelectInput} >
        {cmd[selectedCmd.cmd_id].option.map(option => {
          return <Option key={option.value}>{option.name}</Option>
        })}
      </Select>)
            break;
      default:
        break;
    }
    return (
      <div className="cmdCotent">
        <span className="cmdName">{selectedCmd.name}</span>
          {str}
          <Button type="primary" onClick={this.sendCmd}>发送</Button>
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
    const url = "/api" + "device/sendCmd";
    const {cmdInput, selectedCmd, deviceId} = this.state; 
    let cmd_content = selectedCmd.head + (selectedCmd.sp ? selectedCmd.sp:'') + cmdInput + selectedCmd.tail;
    let data = {
      dev_id: deviceId,
      cmd_id: selectedCmd.cmd_id,
      cmd_name: selectedCmd.name,
      cmd_content: cmd_content 
    }
    http.get(url, data).then(res => {
      console.log(res);
      if (res.data.errcode === 0) {
        this.getCmdResult()
      }
    })
  }
  getCmdResult = (id) => {

  }
  renderMap = () => {
    this.map = new window.BMap.Map("map");
    this.map.centerAndZoom(new window.BMap.Point(this.state.location.longitude || 116.404, this.state.location.latitude ||39.915), 11); // 初始化地图,设置中心点坐标和地图级别
    this.map.addControl(new window.BMap.MapTypeControl()); //添加地图类型控件
    this.map.enableScrollWheelZoom();
    this.geoc = new window.BMap.Geocoder();  
    this.init(); 
  }
  render() {
    let {selectedMarker} = this.state;
    return (      
      <div className="monitor">
        <div className="deviceList">
        <List size="small" header={<div className="deviceHeader">设备列表</div>}
      dataSource={this.state.deviceList}
      renderItem={item => <List.Item onClick={this.selectDevice.bind(this, item.dev_id)} className={ item.dev_id == this.state.deviceId ? "selected" :""}>{item.dev_name}</List.Item>}
      style={{cursor:"pointer"}}
        />
        </div>
        <div className="mapBox">
          <div className="parseAddress">{this.state.parsedAddress}</div>
          <div id="map"></div>
        </div>
        <Modal title="发送指令" visible={this.state.cmdVisible} onOk={this.handleCmdOK} onCancel={this.handleCmdCancel}>
          <Select onChange={this.cmdChange} style={{minWidth: "130px"}} placeholder="请选择指令">
            {this.state.cmdList.map((cmd, index) => {
              return <Option value={cmd.cmd_id} key={cmd.cmd_id}>{cmd.name}</Option>
            })}
          </Select>
            {this.state.selectedCmd.cmd_id && this.renderInputCmd()}         
        </Modal>
      </div>
    )
  }
}