import React, { Component } from 'react';
import './monitor.scss'
import http from './../server.js'
import { List, message } from 'antd'
import car from './../../asset/images/car.png'
import tool from './../../asset/js/util.js'
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
      parsedAddress: ''
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
    const url = "http://webbo.yunjiwulian.com" + "/ent/getRunInfoByEid";
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
          let icon = new window.BMap.Icon(car, new window.BMap.Size(50,50));
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
    const url = "http://webbo.yunjiwulian.com" + "/ent/getSubDeviceInfo"
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
    console.log(time);
    let str = "";
    if ((time/(24*3600)) > 1) {
      str += parseInt(time / (24*3600)) + '天';
    }
    let hour = time % (24*3600);
    console.log(hour);
    if ((hour/3600) > 1) {
      str += parseInt(hour / 3600) + '小时';
    }
    let minute = hour % 3600;
    console.log(minute);

    if ((minute/60) > 1) {
      str += parseInt(minute / 60) + '分钟';
    }
    let second = minute % 60;
    console.log(second);

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
  getLocation = () => {
    const url = "http://webbo.yunjiwulian.com" + "/device/getRunInfoByDevid";
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
      </div>
    )
  }
}
