import {Form, Input, Button,
    message,
    Select,
    Upload
  } from 'antd';
  import React from 'react';
import http from '../server';
import './form.scss'
  
  const {Option} = Select;
  const labelCol = {span: 6};
  const wrapperCol = {span: 18}
  class accountForm extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        showBmsControl: false,
        displayOpt: [],
        controlOpt: [],
        logoLoading: false
      };
    }
    componentWillReceiveProps() {
      let cookie = document.cookie.split(";");
      let cookieParms = {}
      cookie.forEach(item => {
        let objArr = item.split("=");
        cookieParms[objArr[0].trim()] = objArr[1];
      })
      let access_token = cookieParms.access_token;
      let eidLen = parseInt(access_token.substr(3, 2));
      let eid = access_token.substr(5, eidLen);   
      let controlOpt = [];
      let displayOpt = [];
      if (this.props.rootAcc.bms_permission === "2") {
        controlOpt.push('bms');
        displayOpt.push('bms');
      } else if (this.props.rootAcc.bms_permission === "1") {
        displayOpt.push('bms');
      }
      if (this.props.rootAcc.sensor_permission === "2") {
        controlOpt.push('sensor');
        displayOpt.push('sensor');
      } else if (this.props.rootAcc.sensor_permission === "1") {
        displayOpt.push('sensor');
      }
      if (this.props.rootAcc.gps_permission === "2") {
        controlOpt.push('gps');
        displayOpt.push('gps');
      } else if (this.props.rootAcc.gps_permission === "1") {
        displayOpt.push('gps');
      }
      if (this.props.account.eid === Number(eid)){
        this.setState({
          showBmsControl:false,
          displayOpt,
          controlOpt
        })
      } else {
        this.setState({
          showBmsControl:true,
          displayOpt,
          controlOpt
        })
      }
    }
    componentDidMount () {
      this.props.onRef('form', this);
    }
    handleSubmit = e => {
      // e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.saveAccountInfo(values);
        }
      });
    };
    handleSelectChange = e => {
      console.log(e)
    }
 
    saveAccountInfo = (value) => {
      const url =  "/ent/updateEnt";
      let formValue = value;
      if (formValue.controlPermission.indexOf("bms") > -1) {
        formValue.bms_permission = '2';
      } else if (formValue.displayPermission.indexOf('bms') > -1) {
        formValue.bms_permission = '1';
      } else {
        formValue.bms_permission = '0';
      }
      if (formValue.controlPermission.indexOf("sensor") > -1) {
        formValue.sensor_permission = '2';
      } else if (formValue.displayPermission.indexOf('sensor') > -1) {
        formValue.sensor_permission = '1';
      } else {
        formValue.sensor_permission = '0';
      }
      if (formValue.controlPermission.indexOf("gps") > -1) {
        formValue.gps_permission = '2';
      } else if (formValue.displayPermission.indexOf('gps') > -1) {
        formValue.gps_permission = '1';
      } else {
        formValue.gps_permission = '0';
      }
      let data = {
        pid: this.props.account.pid,
        eid: this.props.account.eid,
        phone: formValue.phone,
        addr: formValue.addr,
        email: formValue.email,
        bms_permission: formValue.bms_permission,
        sensor_permission: formValue.sensor_permission,
        gps_permission: formValue.gps_permission

      }
      http.get(url, data).then(res => {
        if (res.data.errcode === 0) {
          message.success("保存信息成功");
        } else if (res.data.errcode === 12) {
          message.error("子账户权限不能大于直属上级");
        } else {
          message.error("保存信息失败");
        }
      })
    }

    render() {
      const { getFieldDecorator } = this.props.form;

      return (
        <Form onSubmit={this.handleSubmit} layout="inline" colon={false}>
          <Form.Item labelCol={labelCol} wrapperCol={wrapperCol}
            label={
              <span>名称</span>
            }
          >
            {getFieldDecorator('name', {
             })(<Input disabled />)}
          </Form.Item>          
          <Form.Item label={
              <span>地址</span>
            } labelCol={labelCol} wrapperCol={wrapperCol}> 
            {getFieldDecorator('addr', {
            })(<Input />)}
          </Form.Item>
          <Form.Item label={
              <span>联系电话</span>
            } labelCol={labelCol} wrapperCol={wrapperCol}>
            {getFieldDecorator('phone', {
            })(<Input />)}
          </Form.Item>          
          <Form.Item label={
              <span>Email</span>
            } labelCol={labelCol} wrapperCol={wrapperCol}>
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: '邮件格式错误',
                }
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label={
              <span>显示权限</span>
            } className={this.state.showBmsControl ? 'show' : "hide"} labelCol={labelCol} wrapperCol={wrapperCol} >
            {getFieldDecorator('displayPermission')(<Select mode="multiple" placeholder=" 显示权限" onChange={this.handleSelectChange}>
            {this.state.displayOpt.map(opt => {
                return <Option key={opt} value={opt}>{opt}</Option>
              })}
            </Select>)}
          </Form.Item>
          <Form.Item label={
              <span>控制权限</span>
            } className={this.state.showBmsControl ? 'show' : "hide"} labelCol={labelCol} wrapperCol={wrapperCol} >
            {getFieldDecorator('controlPermission')(<Select mode="multiple" placeholder={"  控制权限"} onChange={this.handleSelectChange}>
              {this.state.controlOpt.map(opt => {
                return <Option key={opt} value={opt}>{opt}</Option>
              })}
            </Select>)}
          </Form.Item>
          
        </Form>
      );
    }
  }
  
  const WrappedAccountForm = Form.create({ name: 'register',
  mapPropsToFields(props) {
    return {
      name: Form.createFormField({
        value: props.account.login_name,
      }),
      addr: Form.createFormField({
        value: props.account.addr,
      }),
      phone: Form.createFormField({
        value: props.account.phone,
      }),
      email: Form.createFormField({
        value: props.account.email,
      }),
      displayPermission: Form.createFormField({
        value: props.account.displayPermission
      }),
      controlPermission: Form.createFormField({
        value: props.account.controlPermission
      })
    };
  } })(accountForm);
  
  export default WrappedAccountForm