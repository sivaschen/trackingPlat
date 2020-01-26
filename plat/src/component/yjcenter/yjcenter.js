import React, {Component} from 'react'
import { Input, Button, message } from 'antd'
import './yjcenter.scss'
import http from '../server';
const { TextArea } = Input


export default class YJCenter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product_type: '',
            imeis: ''
        }
    }
    componentDidMount () {
    	// 调用父组件方法把当前实例传给父组件
        this.props.onRef('yjcenter', this)
    }
    getProductType = (e) => {
        this.setState({
            product_type: e.target.value
        })
    }
    getImeis = (e) => {
        this.setState({
            imeis: e.target.value
        })
    }
    onRef = () => {
        this.props.onRef('yjcenter', this)
    }
    init = () => {
        console.log('aaaaaaaaaa')
    }
    importImeis = ()=> {
        const url = "/apidevice/importDevices";
        let data = {
            target_eid: this.props.eid,
            product_type: this.state.product_type,
            device_infos: this.state.imeis
        }
        http.get(url, data).then(res => {
            console.log(res)
            if (res.data.errcode === 0) {
                message.success('导入成功');
            }
        })
    }
    render () {
        return (
            <div className="importDevice">
                <Input className="productTypeInput" placeholder="请输入型号" value={this.state.product_type} onChange={this.getProductType}></Input>
                <TextArea className="imeisInput" row = {4} placeholder="请输入IMEI号码" value={this.state.imeis} onChange={this.getImeis}/>
                <div className="btn">
                    <Button onClick={this.importImeis}>导入</Button>
                </div>
            </div>
        )
    }
}