import React, {Component} from 'react';
import http from './../server';
import ReactEcharts from "echarts-for-react";
import { Select, message } from "antd";
import { red } from 'ansi-colors';
import './sensor.scss'
const { Option } = Select;
export default class Monitor extends Component {
    constructor(props) {
      super(props)
      this.state = {
        deviceList: [],
        currentDevice: ''
      }
    }
    componentDidMount () {        
        this.props.onRef('yjcenter', this);
        this.init();
    }
    init = () => {
        this.getDeviceList()
    }
    getDeviceList = () => {
        const url =  "/ent/getSubDeviceInfo"
        let data = {
            eid: this.props.eid
        }
        http.get(url, data).then(res => {
          if (res.data.errcode === 0) {
              let records = res.data.data.records;
              this.setState({
                deviceList: records,
                currentDevice: records[0].dev_id
              }, () => {
                  this.getGaugeData(records[0].dev_id);
              })
            }
        })
      }
    changeDevice = devid => {
        this.setState({
            currentDevice: devid
        }, () => {
            this.getGaugeData(devid);
        })
    }
    getGaugeData = (devid) => {
        const url =  "/device/getRunInfoByDevid";
        let data = {
            dev_id: devid
        };
        http.get(url, data).then(res => {
            if (res.data.errcode === 0) {
                let data = res.data.data;
                console.log(data);
            } else {
                message.error("获取数据失败");
            }
        })
    }
    render () {
        let {deviceList} = this.state;
        return (
            <div className="sensor">
                <div className="deviceList">
                    <span>选择设备：</span>
                    <Select style={{width: "100px"}} onChange={this.changeDevice} value={this.state.currentDevice}>
                        {deviceList.map(item => {
                            return <Option key={item.imei} value={item.dev_id} >{item.dev_name}</Option>
                        })}
                    </Select>
                </div>
                <div className="gaugeData">
                        <div className="voltageBox">
                            <ReactEcharts style={{width:"100%",height: "175px", fontSize: "10px",display: "inline-block", float: "left"}}  option={{
                            textStyle: {fontSize: 12},
                                tooltip: {
                                    formatter: '{a} <br/>{b} : {c}%'
                                },
                            series: [                            
                                {
                                    name: '电压',
                                    type: 'gauge',
                                    detail: {formatter: '{value} V', fontSize: 12, offsetCenter: [0, "60%"]},
                                    data: [{value: (10), name: '电压'}],
                                    min: 0,
                                    max: 1000,
                                    title: {
                                        color: red,
                                        offsetCenter: [0, '40%']
                                    },
                                    axisLine: {            // 坐标轴线
                                        lineStyle: {       // 属性lineStyle控制线条样式
                                            width: 10
                                        }
                                    },splitLine: {           // 分隔线
                                        length: 20,         // 属性length控制线长
                                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                            color: 'auto'
                                        }
                                    },
                                    axisLabel: {
                                        show: false
                                    }
                                }
                            ]}} />
                        </div>
                        <div className="voltageBox">
                            <ReactEcharts style={{width:"100%",height: "175px", fontSize: "10px",display: "inline-block", float: "left"}}  option={{
                            textStyle: {fontSize: 12},
                                tooltip: {
                                    formatter: '{a} <br/>{b} : {c}%'
                                },
                            series: [                            
                                {
                                    name: '电压',
                                    type: 'gauge',
                                    detail: {formatter: '{value} V', fontSize: 12, offsetCenter: [0, "60%"]},
                                    data: [{value: (10), name: '电压'}],
                                    min: 0,
                                    max: 1000,
                                    title: {
                                        color: red,
                                        offsetCenter: [0, '40%']
                                    },
                                    axisLine: {            // 坐标轴线
                                        lineStyle: {       // 属性lineStyle控制线条样式
                                            width: 10
                                        }
                                    },splitLine: {           // 分隔线
                                        length: 20,         // 属性length控制线长
                                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                            color: 'auto'
                                        }
                                    },
                                    axisLabel: {
                                        show: false
                                    }
                                }
                            ]}} />
                        </div><div className="voltageBox">
                            <ReactEcharts style={{width:"100%",height: "175px", fontSize: "10px",display: "inline-block", float: "left"}}  option={{
                            textStyle: {fontSize: 12},
                                tooltip: {
                                    formatter: '{a} <br/>{b} : {c}%'
                                },
                            series: [                            
                                {
                                    name: '电压',
                                    type: 'gauge',
                                    detail: {formatter: '{value} V', fontSize: 12, offsetCenter: [0, "60%"]},
                                    data: [{value: (10), name: '电压'}],
                                    min: 0,
                                    max: 1000,
                                    title: {
                                        color: red,
                                        offsetCenter: [0, '40%']
                                    },
                                    axisLine: {            // 坐标轴线
                                        lineStyle: {       // 属性lineStyle控制线条样式
                                            width: 10
                                        }
                                    },splitLine: {           // 分隔线
                                        length: 20,         // 属性length控制线长
                                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                            color: 'auto'
                                        }
                                    },
                                    axisLabel: {
                                        show: false
                                    }
                                }
                            ]}} />
                        </div><div className="voltageBox">
                            <ReactEcharts style={{width:"100%",height: "175px", fontSize: "10px",display: "inline-block", float: "left"}}  option={{
                            textStyle: {fontSize: 12},
                                tooltip: {
                                    formatter: '{a} <br/>{b} : {c}%'
                                },
                            series: [                            
                                {
                                    name: '电压',
                                    type: 'gauge',
                                    detail: {formatter: '{value} V', fontSize: 12, offsetCenter: [0, "60%"]},
                                    data: [{value: (10), name: '电压'}],
                                    min: 0,
                                    max: 1000,
                                    title: {
                                        color: red,
                                        offsetCenter: [0, '40%']
                                    },
                                    axisLine: {            // 坐标轴线
                                        lineStyle: {       // 属性lineStyle控制线条样式
                                            width: 10
                                        }
                                    },splitLine: {           // 分隔线
                                        length: 20,         // 属性length控制线长
                                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                            color: 'auto'
                                        }
                                    },
                                    axisLabel: {
                                        show: false
                                    }
                                }
                            ]}} />
                        </div>
                </div>
            </div>
        )
    }
}