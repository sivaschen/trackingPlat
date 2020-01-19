import {
    Form,
    Input,
    Button,
    message
  } from 'antd';
  import React from 'react';
  
    
  class accountForm extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        confirmDirty: false,
        autoCompleteResult: [],
      };
    }
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);

        }
      });
    };  
    mapPropsToFields(props) {
      return {
        addr: Form.createFormField({
          ...props.account.addr,
          value: props.accopunt.addr.value,
        }),
      };
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
            {getFieldDecorator('nickname', {
              initialValue: this.props.account.login_name
             })(<Input onChange={this.getName} />)}
          </Form.Item>          
          <Form.Item label="地址">
            {getFieldDecorator('address', {
            })(<Input />)}
          </Form.Item>
          <Form.Item label="联系电话">
            {getFieldDecorator('phone', {
              initialValue: this.props.account.phone
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
              initialValue: this.props.account.email
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
    console.log(props)
    return {
      address: Form.createFormField({
        ...props.account.addr,
        value: props.account.addr,
      }),
    };
  } })(accountForm);
  
  export default WrappedAccountForm