import React, {Component} from 'react';
import ReactEcharts from "echarts-for-react";
import './bms.scss';
import http from './../server.js'
import { Select, Tabs, Row, Col, Icon,Modal, Input, Spin, message } from 'antd';
import { red } from 'ansi-colors';
import Wave from './wave.js'
const { Option } = Select;
const { TabPane } = Tabs;

const protectedData = {
    total_over_vol_threshold: {
        name: "总压过压阈值",
        index: 0,
        unit: "V",
        operation: function (value) {
            return value * 100 / 1000
        },
        counterOperation: function (value) {
            return value * 10
        }
    },
    total_under_vol_threshold: {
        name: "总压欠压阈值",
        index: 1,
        unit: "V",
        operation: function (value) {
            return value * 100 / 1000
        },
        counterOperation: function (value) {
            return value * 10
        }
    },
    singlel_over_vol_threshold: {
        name: "单体过压阈值",
        index:2,
        unit: "mV",
        operation: function (value) {
            return value
        },
        counterOperation: function (value) {
            return value
        }
    },
    single_under_vol_threshold: {
        name: "单压欠压阈值",
        index:3,
        unit: "mV",
        operation: function (value) {
            return value
        },
        counterOperation: function (value) {
            return value 
        }
    },
    total_over_vol_recovery: {
        name: "总压过压恢复值",
        index:4,
        unit: "V",
        operation: function (value) {
            return value * 100 / 1000
        },
        counterOperation: function (value) {
            return value * 10
        }
    },
    total_under_vol_recovery: {
        name: "总压欠压恢复值",
        index:5,
        unit: "V",
        operation: function (value) {
            return value * 100 / 1000
        },
        counterOperation: function (value) {
            return value * 10
        }
    },
    single_over_vol_recovery: {
        name: "单体过压恢复值",
        index:6,
        unit: "mV",
        operation: function (value) {
            return value
        },
        counterOperation: function (value) {
            return value
        }
    },
    single_under_vol_recovery: {
        name: "单体欠压恢复值",
        index:7,
        unit: "mV",
        operation: function (value) {
            return value
        },
        counterOperation: function (value) {
            return value
        }
    },
    temp_charge_high_threshold: {
        name: "充电高温阈值",
        index:8,
        unit: "℃",
        operation: function (value) {
            return value
        },
        counterOperation: function (value) {
            return value
        }
        
    },
    temp_charge_low_threshold: {
        name: "充电低温阈值",
        index:9,
       unit: "℃",
       operation: function (value) {
           return value - 40
       },
        counterOperation: function (value) {
            return value + 40
        }
    },
    temp_discharge_high_threshold: {
        name: "放电高温阈值",
        index: 10,
        unit: "℃",
        operation: function (value) {
            return value - 40
        },
        counterOperation: function (value) {
            return value + 40
        }
    },
    temp_discharge_low_threshold: {
        name: "放电低温阈值",
        index: 11,
        unit: "℃",
        operation: function (value) {
            return value - 40
        },
        counterOperation: function (value) {
            return value + 40
        }
    },
    temp_charge_high_recovery: {
        name: "充电高温恢复值",
        index: 12,
        unit: "℃",
        operation: function (value) {
            return value - 40
        },
        counterOperation: function (value) {
            return value + 40
        }
    },
    temp_charge_low_recovery: {
        name: "充电低温恢复值",
        index: 13,
        unit: "℃",
        operation: function (value) {
            return value - 40
        },
        counterOperation: function (value) {
            return value + 40
        }
    },
    temp_discharge_high_recovery: {
        name: "放电高温恢复值",
        index: 14,
        unit: "℃",
        operation: function (value) {
            return value - 40
        },
        counterOperation: function (value) {
            return value + 40
        }
    },
    temp_discharge_low_recovery: {
        name: "放电低温恢复值",
        index: 15,
        unit: "℃",
        operation: function (value) {
            return value - 40
        },
        counterOperation: function (value) {
            return value + 40
        }
    },
    curr_charge_over_threshold: {
        name: "充电过流阈值",
        index: 16,
        unit: "mA",
        operation: function (value) {
            return value * 10
        },
        counterOperation: function (value) {
            return value / 10
        }
    },
    curr_discharge_over_threshold: {
        name: "放电过流阈值",
        index: 17,
        unit: "mA",
        operation: function (value) {
            return value * 10
        },
        counterOperation: function (value) {
            return value / 10
        }
    },
    curr_charge_over_recovery: {
        name: "充电过流恢复值",
        index: 18,
        unit: "mA",
        operation: function (value) {
            return value * 10
        },
        counterOperation: function (value) {
            return value / 10
        }
    },
    curr_discharge_over_recovery: {
        name: "放电过流恢复值",
        index: 19,
        unit: "mA",
        operation: function (value) {
            return value * 10
        },
        counterOperation: function (value) {
            return value / 10
        }
    },
    balence_open_vol: {
        name: "均衡开启电压",
        index: 20,
        unit: "mV",
        operation: function (value) {
            return value
        },
        counterOperation: function (value) {
            return value
        }
    },
    balence_open_dp: {
        name:"均衡开启压差",
        index:21,
        unit: "mV",
        operation: function (value) {
            return value
        },
        counterOperation: function (value) {
            return value
        }
    },
    balence_close_dp: {
        name:"均衡关闭压差",
        index:22,
        unit: "mV",
        operation: function (value) {
            return value
        },
        counterOperation: function (value) {
            return value
        }
    },
    over_vol_delay: {
        name:"过压保护延时",
        index:23,
        unit: "S",
        operation: function (value) {
            return value
        },
        counterOperation: function (value) {
            return value
        }
    },
    under_vol_delay: {
        name:"欠压保护延时",
        index:24,
        unit: "S",
        operation: function (value) {
            return value
        },
        counterOperation: function (value) {
            return value
        }
    },
    over_current_delay: {
        name:"过流保护延时",
        index:25,
        unit: "S",
        operation: function (value) {
            return value
        },
        counterOperation: function (value) {
            return value
        }
    },
    single_high_temp_delay: {
        name:"单体高温保护延时",
        index:26,
        unit: "S",
        operation: function (value) {
            return value
        },
        counterOperation: function (value) {
            return value
        }
    },
    single_low_temp_delay: {
            name:"单体低温保护延时",
            index:27,
            unit:"S",
            operation: function (value) {
                return value 
            },
            counterOperation: function (value) {
                return value
            },
            newValue: ''
        },
    mos_high_temp_delay: {
        name:"MOS管高温保护延时",
        index:28,
        unit:"S",
        operation: function (value) {
            return value
        },
        counterOperation: function (value) {
            return value 
        }
    },
    mos_high_temp_threshold: {
        name:"MOS管高温阈值",
        index:29,
        unit: "℃",
        operation: function (value) {
            return value - 40
        },
        counterOperation: function (value) {
            return value + 40
        }
    },
    mos_high_temp_recovery:{ 
        name: "MOS管高温恢复阈值",
        index:30,
        unit: "℃",
        operation: function (value) {
            return value - 40
        },
        counterOperation: function (value) {
            return value + 40
        }
    }
}

const alarms =[
    {
        name: "总压过压",
        value: 1 << 8
    },{
        name: "总压欠压",
        value: 1 << 9
    },{
        name: "单压过压",
        value: 1 << 10
    },{
        name: "单压欠压",
        value: 1 << 11
    },{
        name: "放电过温",
        value: 1 << 12
    },{
        name: "充电过温",
        value: 1 << 13
    },{
        name: "放电低温",
        value: 1 << 14
    },{
        name: "充电低温",
        value: 1 << 15
    },{
        name: "充电短路",
        value: 1 << 16
    },{
        name: "放电短路",
        value: 1 << 17
    },{
        name: "充电过流",
        value: 1 << 18
    },{
        name: "放电过流",
        value: 1 << 19
    },{
        name: "分流器或MOS管过温",
        value: 1 << 20
    },{
        name: "单体压差",
        value: 1 << 21
    },{
        name: "SOC",
        value: 1 << 22
    },{
        name: "SOH",
        value: 1 << 23
    },
    
]
let day = new Date().getDate();
let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let today = year + '/' + month + '/' + day;
const option = {
    title: {
        text: '实时电压曲线 V',
        show: true,
        textStyle: {
            color: "#ccc",
            fontWeight: 'normal',
            fontSize: "12px",
            height:"14px"

        }
    },
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        top: 25,
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        color: "#fff"
    },
    xAxis: {
        type: 'time',
        splitLine: {
            show: false
        },
        nameTextStyle: {
            color: "#ddd"
        },
        axisLabel:{
            color: '#ddd'
        },
        axisLine: {
            lineStyle: {
                color: "#ddd"
            }
        }
        
    },
    yAxis: {
        boundaryGap: [0, "100%"],
        type: 'value',
        axisLabel:{
            color: '#ddd'
        },
        axisLine: {
            lineStyle: {
                color: "#ddd"
            }
        },
        min: 0,
        max: 100,
        splitNumber: 2
    },
    series: [
        {
            name: '电压',
            type: 'line',
            data: [
                {
                    name: today + " 02:00:00",
                    value: [today + " 00:00:00", 87]
                },{
                    name: "0:00",
                    value: [today + " 02:04:00", 34]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 04:07:00", 54]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 6:07:00", 65]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 08:07:00", 23]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 10:07:00", 14]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 12:07:00", 76]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 14:07:00", 87]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 16:07:00", 54]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 18:07:00", 34]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 20:07:00", 23]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 22:07:00", 23]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 24:00:00", 65]
                }
            ]
        }
    ]
}
const optionForCurrent = {
    title: {
        text: '实时电流曲线 A',
        show: true,
        textStyle: {
            color: "#ccc",
            fontWeight: 'normal',
            fontSize: "12px",
            height:"14px"

        }
    },
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        top: 25,
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        color: "#fff"
    },
    xAxis: {
        type: 'time',
        splitLine: {
            show: false
        },
        nameTextStyle: {
            color: "#ddd"
        },
        axisLabel:{
            color: '#ddd'
        },
        axisLine: {
            lineStyle: {
                color: "#ddd"
            }
        }
        
    },
    yAxis: {
        boundaryGap: [0, "100%"],
        type: 'value',
        axisLabel:{
            color: '#ddd'
        },
        axisLine: {
            lineStyle: {
                color: "#ddd"
            }
        },
        min: 0,
        max: 100,
        splitNumber: 2
    },
    series: [
        {
            name: '电压',
            type: 'line',
            data: [
                {
                    name: today + " 02:00:00",
                    value: [today + " 00:00:00", 87]
                },{
                    name: "0:00",
                    value: [today + " 02:04:00", 34]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 04:07:00", 54]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 6:07:00", 65]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 08:07:00", 23]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 10:07:00", 14]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 12:07:00", 76]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 14:07:00", 87]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 16:07:00", 54]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 18:07:00", 34]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 20:07:00", 23]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 22:07:00", 23]
                },{
                    name: today + " 08:07:00",
                    value: [today + " 24:00:00", 65]
                }
            ]
        }
    ]
}
const volPercentage = [
    {
        percentage: 0,
        voltage:  2550
    }, 
    {
        percentage: 5,
        voltage:  3009
    }, 
    {
        percentage: 10,
        voltage: 3101
    }, 
    {
        percentage: 15,
        voltage: 3122
    }, 
    {
        percentage: 20,
        voltage: 3146
    },					
    {
        percentage: 25,
        voltage: 3167
    },
    {
        percentage: 30,
        voltage: 3182
    },
    {
        percentage: 35,
        voltage: 3193
    },
    {
        percentage: 40,
        voltage: 3201
    },
    {
        percentage: 45,
        voltage: 3207
    }, 
    {
        percentage: 50,
        voltage: 3212
    }, 
    {
        percentage: 55,
        voltage: 3216
    }, 
    {
        percentage: 60,
        voltage: 3221
    }, 
    {
        percentage: 65,
        voltage: 3227
    },
    {
        percentage: 70,
        voltage: 3235
    }, 
    {
        percentage: 75,
        voltage: 3244
    }, 
    {
        percentage: 80,
        voltage: 3251
    }, 
    {
        percentage: 85,
        voltage: 3256
    }, 
    {
        percentage: 90,
        voltage: 3260
    }, 
    {
        percentage: 95,
        voltage: 3263
    }, 
    {
        percentage: 100,
        voltage: 3450
    }
  ]
export default class Bms extends Component {
    constructor (props){
        super(props);
        this.state = {
            panes: [],
            activeKey: '',
            deviceList: [],
            selectedDevice: {key: ''},
            defaultSelectedDevice: '',
            visible: false,
            loading: false,
            newProtectedData: {}
        }
    }
    componentDidMount () {
        if (this.props.permission === 0) {
            this.props.bmsNoPerm();
        }
        this.props.onRef('yjcenter', this);
        this.init();
    }
    init = () => {
        let { devid } = this.props;
        this.setState({
            deviceList: [],
            selectedDevice: {key: ''},
            activeKey: ''
        }, () => {
            this.getDeviceList();
        })
    }
    onRef = () => {
        this.props.onRef('bms', this)
    }
    renderProtectedData = (data) => {
        let arr = [];
        for (const key in protectedData) {
            let str = <li key={key} className="item"><span className="title">{protectedData[key].name + '：'}</span><span className="data">{protectedData[key].operation(data[key]) || 0}</span><span className="unit">{protectedData[key].unit}</span></li>
            arr.push(str);
        }
        return arr
    }
    renderProtectedDataEdit = () => {
        let arr = [];
        for (const key in protectedData) {
            let str = <li key={key} className="item"><span className="title">{protectedData[key].name + '：'}</span><Input value={this.state.newProtectedData[key] || ''} data-item={key} onChange={this.getProtectedData} className="data" addonAfter={protectedData[key].unit} /></li>
            arr.push(str);
        }
        return <ul className="clearfix">{arr}</ul>

    }
    getProtectedData = (e) => {
        let name = e.target.getAttribute("data-item");
        let { newProtectedData } = this.state;
        newProtectedData[name] = e.target.value;
        this.setState({
            newProtectedData
        })

    }
    sendBmsCmd = (arr, count) => {
        
        let str = "";
        let slicedArr = [];
        if (count === Math.ceil(arr.length / 8)) {
            slicedArr = arr.slice((count-1)* 8);
        } else {
            slicedArr = arr.slice((count - 1)*8, (count - 1)*8 + 8);
        }
        str = slicedArr.join(",");
        let data = {
            cmd_content: "BMSPARAM," + str+ '#'
        }
        const url =  "/device/sendCmd?dev_id=" + this.state.activeKey +  "&cmd_id=100&cmd_name=bms";
        http.get(url, data).then(res => {
            if (res.data.errcode === 0) {
                if (Math.ceil(arr.length / 8) === count) {
                    message.success("修改数据成功");
                    this.setState({
                        visible: false,
                        newProtectedData: {}
                    })
                } else {
                    this.sendBmsCmd(arr, count+=1);
                }
            } else {
                message.error("修改数据失败");
            }
        })
    }
    handleCancel = () => {
        this.setState({
            visible: false,
            newProtectedData: {}
        })
    }
    handleOk = () => {
        let {newProtectedData} = this.state;
        let arr = [];
        for (const key in newProtectedData) {
            arr.push(protectedData[key].index + ',' + protectedData[key].counterOperation(newProtectedData[key]))
        }
        this.sendBmsCmd(arr,1);
    }
    renderTabData = data => {
        let dev_id = this.state.selectedDevice.key
        return (<div style={{overflow: 'auto'}}> 
                <Row className="bmsContent">
                    <Col className="version" span={10}>                        
                        <div className="specifics">
                            <Row className="top">
                                <Col className="graph" span={8}>
                                    <Wave socPercentage={data.SOC} />
                                </Col>
                                <Col className="hardware" span={8}>
                                    <div className="isDischarge">
                                        <div className="currentCharge">
                                            <i className={data.current > 0 ? "circle green" : "circle red"}></i>
                                            <span className="dischargeTxt">{data.current > 0 ? "放电中" : "设备未上电"}</span>
                                        </div>
                                        <div className="fullCharge">
                                            <i className={data.SOC > 95 ? "circle green" : data.SOC > 20 ? "circle blue": "circle red"}></i>
                                            <span className="dischargeTxt">{data.SOC > 95 ? "满电" : data.SOC > 20 ? "正常" : "亏电"}</span>
                                        </div>
                                    </div>
                                    <span className="sn">{"产品编号："+ data.SN}</span><br/>
                                    <span className="sn">{"设备id："+ data.SN}</span><br/>
                                    <span className="sn">{"产品型号：易电"}</span><br/>
                                    <span className="sn">{"电池类型：钴酸锂"}</span><br/>
                                </Col>
                                <Col className="manufacture" span={8}>
                                    <header className="header">
                                        <span></span>
                                        <span>版本信息<Icon type="info-circle" style={{marginLeft:"5px"}} /></span>
                                    </header>
                                        <span className="sn">{"出厂日期："+ data.Date}</span><br/>
                                        <span className="sn">{"开始使用时间："+ data.SN}</span><br/>
                                        <span className="sn">{"设备制造厂商：易电"}</span><br/>
                                </Col>
                            </Row>
                            <Row className="bottom">
                                <Col className="batteryParam" span={16}>
                                    <Row className="batteryParamTop batteryRow">                            
                                            <Col span={12}><span><i className="sp"></i><i className="title">额定容量</i><br/><span className="data">{data.rated_capacity+" Ah"}</span></span></Col>
                                            <Col span={12}><span><i className="sp"></i><i className="title">累计放电容量</i><br/><span className="data">{data.discharge_capacity+" Ah"}</span></span></Col>
                                    </Row>
                                    <Row className="batteryParamMiddle batteryRow">
                                            <Col span={12}><span><i className="sp"></i><i className="title">充放电次数</i><br/><span className="data">{(Number(data.discharge_count) + Number(data.charge_count))+" 次"}</span></span></Col>
                                            <Col span={12}><span><i className="sp"></i><i className="title">电池串数</i><br/><span className="data">{Number(data.real_pack_cnt)+" 串"}</span></span></Col>
                                    </Row>
                                    <Row className="batteryParamBottom batteryRow">
                                            <Col span={6}><span><i className="sp"></i><i className="title">最高单体电压</i><br/><span className="data">{data.max_vol+" mV"}</span></span></Col>
                                            <Col span={6}><span><i className="sp"></i><i className="title">最低单体电压</i><br/><span className="data">{data.min_vol+" mV"}</span></span></Col>
                                            <Col span={6}><span><i className="sp"></i><i className="title">最高单体温度</i><br/><span className="data">{(data.max_temp - 40) +" ℃"}</span></span></Col>
                                            <Col span={6}><span><i className="sp"></i><i className="title">最低单体温度</i><br/><span className="data">{(data.min_temp - 40)+" ℃"}</span></span></Col>
                                    </Row>
                                </Col>
                                <Col span={8} className="temperature">
                                        <span><i className={(data.averge_temp - 40) > 80 ? "red" : "green"}></i>{"MOS温度 "+(data.averge_temp - 40)+"℃"}</span><br/>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col span={5} className="currentGraph">
                        <div className="graphTop clearfix">
                            <div className="voltageBox">
                            <ReactEcharts style={{width:"100%",height: "175px", fontSize: "10px",display: "inline-block", float: "left"}}  option={{
                            textStyle: {fontSize: 12},
                                tooltip: {
                                    formatter: '{b} : {c} V'
                                },
                            series: [                            
                                {
                                    name: '电压',
                                    type: 'gauge',
                                    detail: {formatter: '{value} V', fontSize: 12, offsetCenter: [0, "60%"],color: '#ffffff'},
                                    data: [{value: (data.total_vol / 10), name: '电压'}],
                                    min: 0,
                                    max: 1000,
                                    title: {
                                        color: "#fff",
                                        offsetCenter: [0, '40%']
                                    },
                                    axisLine: {            // 坐标轴线
                                        lineStyle: {       // 属性lineStyle控制线条样式
                                            width: 10,
                                            color: [[0.2, '#ff3e3e'], [0.8, '#1d97ff'], [1, '#11d660']]
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
                            <div className="currentBox">
                                <ReactEcharts style={{width:"100%",height: "175px",  fontSize: "10px",display: "inline-block"}} option={{
                                tooltip: {
                                    formatter: '{b} : {c} A'
                                },
                            series: [                            
                                {
                                    name: '电流',
                                    type: 'gauge',
                                    detail: {formatter: '{value} A',fontSize: 12, offsetCenter: [0, "60%"], color: '#ffffff'},
                                    data: [{value: (data.current  / 100), name: '电流'}],
                                    min: 0,
                                    max: 10,
                                    title: {
                                        color: "#fff",
                                        offsetCenter: [0, '40%']
                                    },
                                    axisLine: {            // 坐标轴线
                                        lineStyle: {       // 属性lineStyle控制线条样式
                                            width: 10,
                                            color: [[0.2, '#ff3e3e'], [0.8, '#1d97ff'], [1, '#11d660']]
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
                        <div className="graphBottom clearfix">
                        <div className="capacityBox">
                            <ReactEcharts style={{width:"100%",height: "175px",  fontSize: "10px",display: "inline-block" ,float: "left"}} option={{
                                tooltip: {
                                    formatter: '{b} : {c} Ah'
                                },
                            series: [                            
                                {
                                    name: '容量',
                                    type: 'gauge',
                                    detail: {formatter: '{value} Ah',fontSize: 12, offsetCenter: [0, "60%"],color: '#ffffff'},
                                    data: [{value: data.remaining_capacity, name: '容量'}],
                                    min: 0,
                                    max: data.rated_capacity,
                                    title: {
                                        color: "#fff",
                                        offsetCenter: [0, '40%']
                                    },
                                    axisLine: {            // 坐标轴线
                                        lineStyle: {       // 属性lineStyle控制线条样式
                                            width: 10,
                                            color: [[0.2, '#ff3e3e'], [0.8, '#1d97ff'], [1, '#11d660']]
                                        }
                                    },splitLine: {           // 分隔线
                                        length: 15,         // 属性length控制线长
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
                        <div className="socBox">
                            <ReactEcharts style={{width:"100%",height: "175px",  fontSize: "10px",display: "inline-block", float: "left"}}  option={{
                                tooltip: {
                                    formatter: '{b} : {c}%'
                                },
                            series: [                            
                                {
                                    name: 'SOC',
                                    type: 'gauge',
                                    detail: {formatter: '{value} %',fontSize: 12, offsetCenter: [0, "60%"],color: '#ffffff'},
                                    data: [{value: data.SOH, name: 'SOH'}],
                                    min: 0,
                                    max: 100,
                                    title: {
                                        color: "#fff",
                                        offsetCenter: [0, '40%']
                                    },
                                    axisLine: {            // 坐标轴线
                                        lineStyle: {       // 属性lineStyle控制线条样式
                                            width: 10,
                                            color: [[0.2, '#ff3e3e'], [0.8, '#1d97ff'], [1, '#11d660']]
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
                    </Col>
                    <Col span={8} className="alarmAndData">
                        <div className="alarm">
                            {this.renderAlarms(data)}
                        </div>
                        <div className="protectedData">
                            <header>
                                <span className="title">参数配置信息</span>
                                <span className="setParams" onClick={this.setProtectedData}>设置<Icon type="right-circle" style={{marginLeft: "3px"}}/></span>
                                <span className="powerOff" data-devid={dev_id} onClick={this.switchOff.bind(this)}>断油电</span>
                                <span className="powerOn" data-devid={dev_id} onClick={this.switchOn.bind(this)}>开油电</span>
                            </header>
                            <ul className="clearfix">
                                {this.renderProtectedData(data)}
                            </ul>

                        </div>
                    </Col>
                </Row>
                <Row className="bmsContentBottom">
                <Col span={8} className="lineGraph">
                    <div className="voltageGraph">
                        <ReactEcharts style={{width:"100%",height: "100px", fontSize: "10px",display: "inline-block", float: "left"}} option={option} />
                    </div>
                    <div className="currentGraph">
                    <ReactEcharts style={{width:"100%",height: "100px", fontSize: "10px",display: "inline-block", float: "left"}} option={optionForCurrent} />

                    </div>
                </Col>
                <Col span={15} className="singleBatteryStatus">
                    <header>
                        <span>单体电池状态</span>
                    </header>
                    <ul className="singleBattery clearfix">
                        {this.renderSingleBattery(data)}
                    </ul>
                </Col>
            </Row>
             </div>
        )
    }

    switchOn = (e) => {
        let dev_id = e.target.getAttribute('data-devid');
        this.setState({
            loading: true
        }, () => {
            const url =  "/device/sendBmsRelayCmd";
            let data = {
                dev_id: dev_id,
                cmd_content: "RELAY,0#"
            }
            http.get(url, data).then(res => {
                setTimeout(() => {
                    this.setState({loading: false}, () => {
                        if (res.data.errcode === 0) {
                            message.success("指令发送成功");
                            
                        } else {
                            message.error(res.data.msg)
                        }
                    }) 
                }, 1000);
                
            })
        })
        
    }
    switchOff = (e) => {
        let dev_id = e.target.getAttribute('data-devid');

        this.setState({
            loading: true,
        }, () => {
            const url =  "/device/sendBmsRelayCmd";
            let data = {
                dev_id: dev_id,
                cmd_content: "RELAY,1#"
            }
            http.get(url, data).then(res => {
                setTimeout(() => {
                    this.setState({loading: false}, () => {
                        if (res.data.errcode === 0) {
                            message.success("指令发送成功");
                            
                        } else {
                            message.error(res.data.msg)
                        }
                    }) 
                }, 1000);
            })
        })
    }
    renderSingleBattery = (data) => {
        let arr = [];
        let htmlArr = [];
        for (const key in data) {
            if (/sigvol_([0-9])_bat[1-4]_vol/.test(key)) {
                let group = key.substr(7,1);
                if (!arr[group]) {
                    arr[group]  = [];
                }
                let index = key.substr(12,1) -1;
                arr[group][index] = data[key];
            }
        }
        for (let i = 0; i < arr.length; i++) {
            let groupData = arr[i];
            for (let j = 0; j < groupData.length; j++) {
                if (groupData[j] === "0") continue;
                let batteryStyle;
                let batteryBox;
                for (let k = volPercentage.length -1; k > 0; k--) {
                    let vol = volPercentage[k].voltage;
                    if (vol< groupData[j]) {
                        let percentage = volPercentage[k+1].percentage;
                        let bgc = percentage > 20 ? "#1CE697" : "#B73B3E";
                        batteryBox = percentage > 20 ? 'imgBox green' : 'imgBox red';
                        batteryStyle = {height: (percentage / 100 * 34) + 'px', backgroundColor: bgc};
                        break;
                    }
                }
                let str = 
                    <li className="singleBattery" key={ i + "-" + j}>
                        <div className="img">
                            <div className="battery">
                                <div className={batteryBox}></div>
                                <div className="percentage" style={batteryStyle}></div>
                                <span className="data">
                                    <div className="sequence">{'#' + (4*i + (j+1))}</div>
                                    <div className="dataValue">{groupData[j] + " mv"} </div>
                                    </span>                        
                            </div>
                            
                        </div>
                    </li>
                        htmlArr.push(str);
            }
        }
        return htmlArr
    }
    setProtectedData = () => {
        this.setState({
            visible: true
        })
    }
    selectDevice = (value) => {
        this.setState({
            selectedDevice: {key: value.key}
        }, () => {
            this.getBms(value.key, value.label);
        })
    }

    renderAlarms = (data) => {
        return <>
            <header>
                <span className="title">告警状态</span>
            </header>
            <ul className="clearfix">
                {alarms.map(alarm => {
                    let alarmClass = (data.bms_status && alarm.value) ? "notice" : '';
                    if (data.bms_status && alarm.value) {
                        return <li key={alarm.name}>
                            <span className={alarmClass}>{alarm.name}</span>
                        </li>
                    } else {
                        return ''
                    }
                    
                })}
            </ul>
        </>
    }
    getBms = (dev_id, dev_name) => {
        const url = "/device/getBmsInfoByDevid";
        let data = {
            dev_id: dev_id
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
                if (bmsData) {
                    let tabContent = this.renderTabData(bmsData);
                    panes.push(
                        {title: dev_name, content: tabContent, key: dev_id, closable: true}
                    )
                    this.setState({
                        panes,
                        activeKey:dev_id
                    })
                }
                
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
        const url =  "/ent/getSubDeviceInfo";
        let data = {
            eid: this.props.eid
        }
        http.get(url, data).then(res => {
            if (res.data.errcode === 0) {
                let deviceList = res.data.data.records;
                this.setState({
                    selectedDevice: this.props.devid ? {key: this.props.devid} : {key: deviceList[0].dev_id},
                    deviceList,
                    panes: []
                }, () => {
                    if (this.props.devid) {
                        this.getBms(this.props.devid, deviceList[0].dev_name);
                    } else {
                        this.getBms(deviceList[0].dev_id, deviceList[0].dev_name);                        
                    }
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
            <Spin size="large" spinning={this.state.loading} className={"loadingData " + (this.state.loading ? "enabled" : 'disabled')}>
                <div className="bms">                
                    <div className="selectDevice">
                        <span className="title">查看的设备：</span>
                        <Select style={{ width: 120 }} onChange={this.selectDevice} showSearch value={this.state.selectedDevice} labelInValue  placeholder="选择设备"
                optionFilterProp="children"
                onChange={this.selectDevice} filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }>
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
                    <Modal className="setProtectedData" bodyStyle={{height: "400px", overflow:"auto"}}
                        title="设置参数"
                        visible={this.state.visible}
                        onOk={this.handleOk.bind(this)}
                        onCancel={this.handleCancel}
                        >
                        {this.renderProtectedDataEdit()}
                    </Modal>        
                </div>
            </Spin>
        )
    }
}