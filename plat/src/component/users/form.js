import {
    Form,
    Input,
    Button,
    message
  } from 'antd';
  import React from 'react';
import http from '../server';
  
    
  class accountForm extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
      };
    }
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.saveAccountInfo(values);
        }
      });
    };
    saveAccountInfo = (values) => {
      const url = "/api" + "/ent/updateEnt";
      let data = {
        pid: this.props.account.pid,
        eid: this.props.account.eid,
        phone: values.phone,
        addr: values.addr,
        email: values.email
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
    };
  } })(accountForm);
  
  export default WrappedAccountForm