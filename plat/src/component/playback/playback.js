import React from 'react';
import "./playback.scss"
import { DatePicker, Button, message } from 'antd';
import http from './../server.js'
import car from '../../asset/images/car-1.png'
const { RangePicker } = DatePicker;
const polylineOpt =  {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5};
export default class Playback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing:false,
            devid: '',
            beginTime: '',
            endTime: '',
            resEndTime: '',
            polylineArr: [],
            marker: '',
            polyline: null,
            lastPoint: '',
            currentPoint: '',
            timer: '',
            needMoreData: false,
            wholeIndex: 0,
            pauseOrResumeTxt: '暂停'
        }
    }
    onChange = (value, dateString) => {
        this.setState({
            beginTime: new Date(dateString[0]).getTime() / 1000,
            endTime: new Date(dateString[1]).getTime() / 1000            
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
        marker.disableMassClear();
        let polyline = new window.BMap.Polyline([new window.BMap.Point(116.399, 39.910),
            
            ],{strokeColor:"black", strokeWeight:2, strokeOpacity:0.5})
            this.playbackMap.addOverlay(marker);
            polyline.setPath({
                path: [new window.BMap.Point(116.399, 39.910),new window.BMap.Point(116.405, 39.920),new window.BMap.Point(116.425, 39.900)]
            })
            this.playbackMap.addOverlay(polyline);
        this.setState({
            marker,
            polyline
        })
    }
    onOk = (value) => {
        console.log('onOk: ', value);
    }
    startPlay = (beginTime, endTime) => {
        if (!beginTime || !endTime) {
            message.error("请选择开始和结束时间");
            return
        }
        this.playbackMap.clearOverlays();
        const url = "/device/getLocationInfo";
        let {devid} = this.state;
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
        let { endTime } = this.state;
        let endTS = new Date(endTime).getTime() / 1000;
        let needMoreData = (data.infos.length > 0 && data.resEndTime < endTS);
        this.setState({
            polylineArr: data.infos,
            playing: true,
            needMoreData,
            resEndTime: data.resEndTime,
            pauseOrResumeTxt: '暂停',
            lastPoint: ''
        }, () => {
            if (data.infos.length>0) {
                this.moveMarker(0);
            }
        })
    }
    moveMarker = (i) => {
        let { polylineArr, marker, lastPoint, needMoreData, resEndTime, endTime} = this.state;
        let point;
        let polyline = '';
        if (i > (polylineArr.length -1)) {
            if (needMoreData) {
                this.startPlay(resEndTime, endTime)
            }
        }
        point = new window.BMap.Point(polylineArr[i].lng, polylineArr[i].lat);
        marker.setPosition(point);
        marker.setRotation(polylineArr[i].direction + 90);
        if (lastPoint) {
            polyline = new window.BMap.Polyline([
                lastPoint, point
            ], polylineOpt)
            this.playbackMap.addOverlay(polyline);
        }
        
            
        let count = i + 1;
        let timer = setTimeout(() => {
            this.moveMarker(count);
        }, 500);
        this.setState({
            marker,
            lastPoint: point,
            timer,
            wholeIndex: i
        })
    }
    pausePlay = ()=> {
        let {pauseOrResumeTxt, wholeIndex} = this.state;
        if (pauseOrResumeTxt === "暂停") {
            let {timer} = this.state;
            pauseOrResumeTxt = '恢复';
            clearTimeout(timer);
            
        } else {
            this.moveMarker(wholeIndex + 1);
            pauseOrResumeTxt = '暂停';
        }
        this.setState({
            pauseOrResumeTxt: pauseOrResumeTxt
        })
        
    }
    render () {
        return <div className="playbackPage">
            <div className="timePicker">
                <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" placeholder={['开始时间', '结束时间']} onChange={this.onChange} onOk={this.onOk}/>
                <Button onClick={this.startPlay.bind(this, this.state.beginTime, this.state.endTime)} className="btn" type="primary">开始</Button>
                <Button disabled={!this.state.playing} onClick={this.pausePlay.bind(this)} className="btn" type="danger">{this.state.pauseOrResumeTxt}</Button>
            </div>
            <div className="mapPlaybackBox">
                <div id="mapPlayback"></div>
            </div>
        </div>
    }
}