import {Form, Input, Button,
    message,
    Select
  } from 'antd';
  import React from 'react';
import http from '../server';
import './form.scss'
  
  const {Option} = Select;
  class accountForm extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        showBmsControl: false
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

      if (this.props.account.eid === Number(eid)){
        this.setState({
          showBmsControl:false
        })
      } else {
        this.setState({
          showBmsControl:true
        })
      }
    }
    handleSubmit = e => {
      e.preventDefault();
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
      console.log(value)
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
        } else {
          message.error("保存信息失败");
        }
      })
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 6 },
          sm: { span:6 },
        },
        wrapperCol: {
          xs: { span: 18 },
          sm: { span: 18 },
        },
      };
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 20,
            offset: 4,
          },
        },
      };
  
      return (
        <Form {...formItemLayout} onSubmit={this.handleSubmit} layout="inline">
          <Form.Item
            label={
              <span>名称</span>
            }
          >
            {getFieldDecorator('name', {
             })(<Input disabled />)}
          </Form.Item>          
          <Form.Item label="地址">
            {getFieldDecorator('addr', {
            })(<Input />)}
          </Form.Item>
          <Form.Item label="联系电话">
            {getFieldDecorator('phone', {
            })(<Input />)}
          </Form.Item>          
          <Form.Item label="E-mail">
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: '邮件格式错误',
                }
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="显示权限" style={{width: "310px"}} className={this.state.showBmsControl ? 'show' : "hide"} labelCol={{  
          xs: { span: 5 },
          sm: { span:5 }}}  wrapperCol={{ xs: { span: 19 }, sm: { span: 19 }}} >
            {getFieldDecorator('displayPermission')(<Select mode="multiple" placeholder="显示权限" onChange={this.handleSelectChange}>
              <Option key="0" value="bms">BMS</Option>
              <Option  key="1" value="sensor">SENSOR</Option>
              <Option key="2"  value="gps">GPS</Option>
            </Select>)}
          </Form.Item>
          <Form.Item label="控制权限" style={{width: "310px"}} className={this.state.showBmsControl ? 'show' : "hide"} labelCol={{  
          xs: { span: 5 },
          sm: { span:5 }}}  wrapperCol={{ xs: { span: 19 }, sm: { span: 19 }}} >
            {getFieldDecorator('controlPermission')(<Select mode="multiple" placeholder="显示权限" onChange={this.handleSelectChange}>
              <Option key="0" value="bms">BMS</Option>
              <Option key="1" value="sensor">SENSOR</Option>
              <Option key="2" value="gps">GPS</Option>
            </Select>)}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              保 存
            </Button>
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