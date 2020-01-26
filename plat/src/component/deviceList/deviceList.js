import React, {Component} from 'react'
import { Table, Divider, Tag } from 'antd';
import http from '../server';

export default class DeviceList extends Component {
    constructor (props) {
        super(props)
        this.state = {

        }
    }
    getDevice = () => {
        const url = "/apient/getSubDeviceInfo";
        let data = {
            eid: this.props.eid
        }
        http.get(url, data).then(res => {
            console.log(res)
        })
    }
    init = () => {
        this.getDevice()
    }
    render () {
        return (
            <div className="deviceList">
                ddddd
                {this.props.eid}
            </div>
        )
    }
}