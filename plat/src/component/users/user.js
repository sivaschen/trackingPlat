import React from 'react'
import { Button, Icon, message, Form, Input } from 'antd'
import http from './../server'
import MyForm from './form'




export default class User extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            eid: '',
            account: {},
            email: ''
        }
    }
    componentDidMount () {
    	// 调用父组件方法把当前实例传给父组件
        this.props.onRef('user', this)
    }
    onRef = () => {
        this.props.onRef('user', this)
    }
    init = () => {
        let eid = this.props.eid;
        let url = "/apient/getEntInfoByEid";
        http.get(url, {eid: eid}).then((res) => {
        if (res.data.errcode === 0) {
            let data = res.data.data;
            this.setState({
                eid: String(eid),
                account: data
            })
        } else {
            message.error("获取账户信息失败");
        }
        })
    }

    render () {
       
        return (
            <div className="user">
                <div className="accInfo">
                   <MyForm/>
                </div>
                <Button><Icon type="user-add" />添加下级客户</Button>
                <Button><Icon type="user-delete" />删除此用户</Button>
            </div>
        )
    }
}
