import React from 'react'
import car from './../../asset/images/car.png'
import { Map, Marker, APILoader, Label } from '@uiw/react-baidu-map';
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

  

const RenderMap = (props) => {    
    function renderMarker(marker)  {
        let icon = new window.BMap.Icon(car, new window.BMap.Size(50,50));
        return <Marker key={marker.devid} icon={icon} position={{lng: marker.longitude / 1000000, lat: marker.latitude / 1000000}} rotation={marker.course} />
    }
    
    function renderLabel() {
        const {markers, markerIndex} = props;
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
        borderRadius: "5px"}} offset={new window.BMap.Size(40, -65)}  />
    }
    let mapCenter;
    if (props.markers.length) {
        mapCenter = {lng: props.markers[props.markerIndex].longitude / 1000000, lat: props.markers[props.markerIndex].latitude / 1000000};
    }
    return (<APILoader akay="MwFWKXwW1eu3Rxtyh8jos8Vc64QAlvtl">
        <Map widget={['NavigationControl']} enableScrollWheelZoom center={mapCenter} zoom={10} >
          {props.markers.map(marker => {
            return renderMarker(marker)
          })}
          {props.markers.length && renderLabel()}
        </Map>
      </APILoader>)
  }
export default RenderMap