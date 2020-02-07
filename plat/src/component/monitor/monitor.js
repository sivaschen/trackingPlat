import React, { Component } from 'react';
import './monitor.scss'
import http from './../server.js'
import { List, message } from 'antd'
import car from './../../asset/images/car.png'
import tool from './../../asset/js/util.js'
import { Map, Marker, APILoader, Label } from '@uiw/react-baidu-map';
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
      markers: [],
      parsedAddress: '',
      markerIndex: 0
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
    this.init();
  }
  labelCmdClick = (e) => {
    console.log(e)
    this.getCmdList();
  }
  componentDidUpdate () {
    if(document.getElementsByClassName('labelCmd')[0]) {
      document.getElementsByClassName('labelCmd')[0].addEventListener('click', this.labelCmdClick);
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
        let markers = data;
        
        let timer = setTimeout(() => {
          this.getLocationByAccount(false);
        }, 4000)
        this.setState({
          markers,
          timer
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
  };
 
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
    const url = "/api" + "/device/getCmdListByType?product_type=yj03";
    http.get(url).then(res => {
      console.log(res)
    })
  }
  selectDevice = (devId) => {
    let {markers} = this.state;
    let marker = markers[devId];
    this.changeLabel({
      target: marker
    })
  }
  renderMarker = (marker) => {
    let icon = new window.BMap.Icon(car, new window.BMap.Size(50,50));
    return <Marker key={marker.devid} icon={icon} position={{lng: marker.longitude / 1000000, lat: marker.latitude / 1000000}} rotation={marker.course} />
  }
  renderLabel = () => {
    const {markers, markerIndex} = this.state;
    let marker = markers[markerIndex];
    let position = {lng: marker.longitude / 1000000, lat: marker.latitude / 1000000};
    let heartTime = tool.formatTimestamp(marker.heart_time || marker.sys_time);
    let gpsTime = tool.formatTimestamp(marker.gps_time);
    let labelContent = '<span>速 度：'+marker.speed+' km/h</span><br/><span>GPS：'+ gps_status[marker.gps_status]+'</span><br/><span>ACC:'+ acc_status[marker.acc_status] +'</span><br/><span>定位时间：'+ gpsTime +'</span><br/><span>心跳时间：'+ heartTime+'</span><br/>' + '<span>状态：'+ dev_status[marker.dev_status] +'</span><br/>'
    
    if (marker.dev_status === 'offline') {
      let offlineTime = this.formatTimeSpan(marker.offline_time);
      labelContent += '<span>离线时长：'+ offlineTime +'</span><br/>'
    }
    labelContent += '<a class="labelCmd">指令</a>'
    return <Label position={ position } 
    content={labelContent}
    style={{fontSize : "12px",
    fontFamily:"微软雅黑",
    padding: '5px',
    borderColor: 'black',
    borderRadius: "5px"}} offset={new window.BMap.Size(40, -65)} onClick={this.clickLabel} />
  }
  render() {
    let { markers, markerIndex } = this.state;
    let center = {};
    if (markers.length) {
      center = {lng: markers[markerIndex].longitude / 1000000, lat: markers[markerIndex].latitude / 1000000}

    }
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
          <div id="map" >
            <APILoader akay="MwFWKXwW1eu3Rxtyh8jos8Vc64QAlvtl">
              <Map widget={['NavigationControl']} autoLocalCity enableScrollWheelZoom center={center}>
                {markers.map(marker => {
                  return this.renderMarker(marker)
                })}
                {markers.length && this.renderLabel()}
              </Map>
            </APILoader>
          </div>
        </div>
      </div>
    )
  }
}
