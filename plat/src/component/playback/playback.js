import React from 'react';
import "./playback.scss"
import { DatePicker, Button, message } from 'antd';
import http from './../server.js'
import car from '../../asset/images/car-1.png'
const { RangePicker } = DatePicker;
export default class Placyback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            devid: '',
            beginTime: '',
            endTime: '',
            polylineArr: [],
            marker: ''
        }
    }
    onChange = (value, dateString) => {
        this.setState({
            beginTime: dateString[0],
            endTime: dateString[1],
        })
    }
    componentDidMount () {
        let devid = this.props.location.search.split("?")[1].split('=')[1]; 
        this.setState({
            devid: devid
        }, () => {
            this.init();
        })    
    }
    init = () => {
        this.renderMap();
    }
    renderMap = () => {
        this.playbackMap = new window.BMap.Map('mapPlayback');
        this.playbackMap.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
        this.playbackMap.enableContinuousZoom(); 
        this.playbackMap.centerAndZoom(new window.BMap.Point(113.852520,22.587842), 11);
        let point = new window.BMap.Point(113.852520, 22.587842);
        let icon = new window.BMap.Icon(car, new window.BMap.Size(30, 30));
        icon.setImageSize(new window.BMap.Size(30, 30));
        let marker = new window.BMap.Marker(point, {
            icon: icon
        });
        this.playbackMap.addOverlay(marker);
        this.setState({
            marker
        })
    }
    onOk = (value) => {
        console.log('onOk: ', value);
    }
    startPlay = () => {
        const url = "/device/getLocationInfo";
        let {devid, beginTime, endTime } = this.state;
        let begin_tm = new Date(beginTime).getTime() / 1000;
        let end_tm = new Date(endTime).getTime() / 1000;
        let data = {
            dev_id: devid,
            begin_tm : 1580635370,
            end_tm: 1582363370
        };
        http.get(url, data).then(res => {
            if (res.data.errcode === 0) {
                this.processData(res.data.data);
            } else {
                message.error("获取轨迹数据失败" + res.data.errcode)
            }
        })
    }
    processData = (data) => {
        this.setState({
            polylineArr: data.infos
        }, () => {
            this.moveMarker(0);
        })
    }
    moveMarker = (i) => {
        let { polylineArr, marker} = this.state;
        let point = new window.BMap.Point(polylineArr[i].lon / 1000000, polylineArr[i].lat / 1000000);
        marker.setPosition(point);
        let count = i + 1;
        setTimeout(() => {
            this.moveMarker(count);
        }, 500);
    }
    pausePlay = ()=> {
        
    }
    render () {
        return <div className="playbackPage">
            <div className="timePicker">
                <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" placeholder={['开始时间', '结束时间']} onChange={this.onChange} onOk={this.onOk}/>
                <Button onClick={this.startPlay.bind(this)} className="btn" type="primary">开始</Button>
                <Button onClick={this.pausePlay.bind(this)} className="btn" type="danger">暂停</Button>
            </div>
            <div className="mapPlaybackBox">
                <div id="mapPlayback"></div>
            </div>
        </div>
    }
}