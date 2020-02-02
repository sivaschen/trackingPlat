import React, {Component} from 'react';
import ReactEcharts from "echarts-for-react";
import './bms.scss';
import http from './../server.js'
import { Select, Tabs, Row, Col } from 'antd';
import { red } from 'ansi-colors';
const { Option } = Select;
const { TabPane } = Tabs;
export default class Bms extends Component {
    constructor (props){
        super(props);
        this.state = {
            panes: [],
            activeKey: '',
            deviceList: [],
            selectedDevice: {key: ''},
            defaultSelectedDevice: ''
        }
    }
    componentDidMount () {
        this.props.onRef('yjcenter', this);
        this.init();
    }
    init = () => {
        this.setState({
            deviceList: [],
            selectedDevice: {key: ''},
            activeKey: ''
        })
        this.getDeviceList();
    }
    onRef = () => {
        this.props.onRef('bms', this)
    }
    renderTabData = data => {
        return (
            <Row className="bmsContent">
                <Col className="version" span={10}>
                    <header className="header">
                        <span></span>
                        <span style={{ float:'right' }}>版本信息</span>
                    </header>
                    <div className="specifics">
                        <Row className="top">
                            <Col className="graph" span={6}>
                            </Col>
                            <Col className="hardware" span={8}>
                                <span className="sn">{"产品编号："+ data.SN}</span><br/>
                                <span className="sn">{"设备id："+ data.SN}</span><br/>
                                <span className="sn">{"产品型号："+ data.SN}</span><br/>
                                <span className="sn">{"电池类型："+ data.SN}</span><br/>
                            </Col>
                            <Col className="manufacture" span={10}>
                                <ul>
                                    <span className="sn">{"出厂日期："+ data.Date}</span><br/>
                                    <span className="sn">{"开始使用时间："+ data.SN}</span><br/>
                                    <span className="sn">{"设备制造厂商："+ data.SN}</span><br/>
                                </ul>
                            </Col>
                        </Row>
                        <Row className="bottom">
                            <Col className="batteryParam" span={16}>
                                <Row className="batteryParamTop batteryRow">
                                        <Col span={8}><span><i className="title">额定容量</i><br/>{data.rated_capacity+"Ah"}</span></Col>
                                        <Col span={8}><span><i className="title">累计放电容量</i><br/>{data.discharge_capacity+"Ah"}</span></Col>
                                        <Col span={8}><span><i className="title">充放电次数</i><br/>{(data.discharge_count + data.charge_count)+"次"}</span></Col>
                                </Row>
                                <Row className="batteryParamMiddle batteryRow">
                                        <Col span={12}><span><i className="title">压差</i><br/>{data.rated_capacity+"mV"}</span></Col>
                                        <Col span={12}><span><i className="title">电池串数</i><br/>{(data.high_pack_cnt + data.low_pack_cnt)+"串"}</span></Col>
                                </Row>
                                <Row className="batteryParamBottom batteryRow">
                                        <Col span={6}><span><i className="title">最高电压</i><br/>{data.max_vol+"mV"}</span></Col>
                                        <Col span={6}><span><i className="title">最低电压</i><br/>{data.min_vol+"mV"}</span></Col>
                                        <Col span={6}><span><i className="title">最低温度</i><br/>{data.max_temp +"℃"}</span></Col>
                                        <Col span={6}><span><i className="title">最低温度</i><br/>{data.min_temp+"℃"}</span></Col>
                                </Row>
                            </Col>
                            <Col span={8} className="temperature">
                                    <span><i className={data.averge_temp > 25 ? "red" : "green"}></i>{"MOS温度 "+data.averge_temp+"℃"}</span><br/>
                                    <span><i className={data.min_temp > 25 ? "red" : "green"}></i>{"均衡板温度 "+data.min_temp+"℃"}</span><br/>
                                    <span><i className={data.min_temp > 25 ? "red" : "green"}></i>{"功率板温度 "+data.min_temp+"℃"}</span><br/>
                                    <span><i className={data.min_temp > 25 ? "red" : "green"}></i>{"环境温度 "+data.min_temp+"℃"}</span><br/>
                                    <span><i className={data.min_temp > 25 ? "red" : "green"} style={{marginRight:"5px"}}></i>{"T1 "+data.min_temp+"℃"}</span><span style={{marginLeft: '5px'}}><i className={data.min_temp > 25 ? "red" : "green"} style={{marginRight:"5px"}}></i>{"T2 "+data.min_temp+"℃"}</span><br/>
                                    <span><i className={data.min_temp > 25 ? "red" : "green"} style={{marginRight:"5px"}}></i>{"T3 "+data.min_temp+"℃"}</span><span style={{marginLeft: '5px'}}><i className={data.min_temp > 25 ? "red" : "green"} style={{marginRight:"5px"}}></i>{"T4 "+data.min_temp+"℃"}</span><br/>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={7} className="currentGraph">
                    <div className="graphTop clearfix">
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
                                detail: {formatter: '{value}V', fontSize: 12, offsetCenter: [0, "60%"]},
                                data: [{value: data.total_vol, name: '电压'}],
                                min: 0,
                                max: 1000,
                                title: {
                                    color: red,
                                    offsetCenter: [0, '40%']
                                },
                                axisLabel: {
                                    show: false
                                }
                            }
                        ]}} />
                    </div>
                        <div className="currentBox">
                            <ReactEcharts style={{width:"100%",height: "175px",  fontSize: "10px",display: "inline-block"}} option={{
                            tooltip: {
                                formatter: '{a} <br/>{b} : {c}%'
                            },
                        series: [                            
                            {
                                name: '电流',
                                type: 'gauge',
                                detail: {formatter: '{value}A',fontSize: 12, offsetCenter: [0, "60%"]},
                                data: [{value: data.current, name: '电流'}],
                                min: 0,
                                max: 1000,
                                title: {
                                    color: red,
                                    offsetCenter: [0, '40%']
                                },
                                axisLabel: {
                                    show: false
                                }
                            }
                        ]}} />
                    </div>
                    </div>
                    <div className="graphBottom clearfix">
                    <div className="capacityBox">
                        <ReactEcharts style={{width:"100%",height: "175px",  fontSize: "10px",display: "inline-block" ,float: "left"}} option={{
                            tooltip: {
                                formatter: '{a} <br/>{b} : {c}%'
                            },
                        series: [                            
                            {
                                name: '容量',
                                type: 'gauge',
                                detail: {formatter: '{value}V',fontSize: 12, offsetCenter: [0, "60%"]},
                                data: [{value: data.rated_capacity, name: '容量'}],
                                min: 0,
                                max: 1000,
                                title: {
                                    color: red,
                                    offsetCenter: [0, '40%']
                                },
                                axisLabel: {
                                    show: false
                                }
                            }
                        ]}} />
                    </div>
                    <div className="socBox">
                        <ReactEcharts style={{width:"100%",height: "175px",  fontSize: "10px",display: "inline-block", float: "left"}}  option={{
                            tooltip: {
                                formatter: '{a} <br/>{b} : {c}%'
                            },
                        series: [                            
                            {
                                name: 'SOC',
                                type: 'gauge',
                                detail: {formatter: '{value}V',fontSize: 12, offsetCenter: [0, "60%"]},
                                data: [{value: data.SOC, name: 'SOC'}],
                                min: 0,
                                max: 1000,
                                title: {
                                    color: red,
                                    offsetCenter: [0, '40%']
                                },
                                axisLabel: {
                                    show: false
                                }
                            }
                        ]}} />
                    </div>
                    </div>
                    
                </Col>
            </Row>
        )
    }
    selectDevice = (value) => {
        this.setState({
            selectedDevice: {key: value.key}
        }, () => {
            this.getBms(value.key, value.label);
        })
    }

    getBms = (dev_id, dev_name) => {
        console.log(dev_id);
        const url = "/api/device/getBmsInfoByDevid";
        let data = {
            dev_id: 44
        }
        http.get(url, data).then(res => {
            if (res.data.errcode === 0) {
                let { panes } = this.state;
                for (let i = 0; i < panes.length; i++) {
                    let item = panes[i];
                    if (dev_id == item.key) {
                        this.setState({
                            activeKey: dev_id
                        });
                        return
                    }
                }
                let bmsData = res.data.data;
                let tabContent = this.renderTabData(bmsData);
                panes.push(
                    {title: dev_name, content: tabContent, key: dev_id, closable: true}
                )
                this.setState({
                    panes,
                    activeKey:dev_id
                })
            }
        })
    }
    onEditTab = (targetKey, action) => {
        this[action](targetKey);
    }
    remove = targetKey => {
        let { activeKey } = this.state;
        let lastIndex;
        let {panes} = this.state;
        panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
              lastIndex = i - 1;
            }
          });
        const filterPanes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (filterPanes.length && activeKey === targetKey) {
            if (lastIndex >= 0) {
              activeKey = filterPanes[lastIndex].key;
            } else {
              activeKey = filterPanes[0].key;
            }
          }
        this.setState({
            panes: filterPanes,
            activeKey: activeKey
        })
    }
    getDeviceList = () => {
        const url = "/api" + "/ent/getSubDeviceInfo";
        let data = {
            eid: this.props.eid
        }
        http.get(url, data).then(res => {
            if (res.data.errcode === 0) {
                let deviceList = res.data.data.records;
                this.setState({
                    selectedDevice: {key: deviceList[0].dev_id},
                    deviceList,
                    panes: []
                }, () => {
                    this.getBms(deviceList[0].dev_id, deviceList[0].dev_name)
                })
            } else {

            }
        })
    }
    changeTab = activeKey => {
        this.setState({ activeKey });
    }
    render () {
        return (
            <div className="bms">
                <div className="selectDevice">
                    <span className="title">查看的设备：</span>
                    <Select style={{ width: 120 }} onChange={this.selectDevice} value={this.state.selectedDevice} labelInValue>
                        {this.state.deviceList.map(device => (
                            <Option value={device.dev_id} key={device.dev_id}>{device.dev_name}</Option>
                        ))}
                    </Select>
                </div>
                <div className="tab" style={{width: "100%", height: "100%"}}>
                    <Tabs onChange={this.changeTab} type="editable-card" onEdit={this.onEditTab} activeKey={this.state.activeKey} hideAdd> 
                    {this.state.panes.map(pane => (
                        <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                        {pane.content}
                        </TabPane>
                    ))}
                    </Tabs>
                </div>
            </div>
        )
    }
}