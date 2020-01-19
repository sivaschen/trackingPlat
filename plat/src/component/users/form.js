import {
    Form,
    Input,
    Select,
    Button,
    AutoComplete,
  } from 'antd';
  import React from 'react';
  
  const { Option } = Select;
  const AutoCompleteOption = AutoComplete.Option;
    
  class accountForm extends React.Component {
    state = {
      confirmDirty: false,
      autoCompleteResult: [],
    };
  
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    };
  
    handleConfirmBlur = e => {
      const { value } = e.target;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
  
    compareToFirstPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    };
  
    validateToNextPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    };
  
    handleWebsiteChange = value => {
      let autoCompleteResult;
      if (!value) {
        autoCompleteResult = [];
      } else {
        autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
      }
      this.setState({ autoCompleteResult });
    };
  
    render() {
      const { getFieldDecorator } = this.props.form;
      const { autoCompleteResult } = this.state;
  
      const formItemLayout = {
        labelCol: {
          xs: { span: 16 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 16 },
          sm: { span: 16 },
        },
      };
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };
      const prefixSelector = getFieldDecorator('prefix', {
        initialValue: '86',
      })(
        <Select style={{ width: 70 }}>
          <Option value="86">+86</Option>
          <Option value="87">+87</Option>
        </Select>,
      );
  
      const websiteOptions = autoCompleteResult.map(website => (
        <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
      ));
  
      return (
        <Form {...formItemLayout} onSubmit={this.handleSubmit} layout="inline">
          <Form.Item label="E-mail">
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                }
              ],
            })(<Input />)}
          </Form.Item>

          <Form.Item
            label={
              <span>名称</span>
            }
          >
            {getFieldDecorator('nickname', {
             })(<Input />)}
          </Form.Item>
          <Form.Item label="地址">
            {getFieldDecorator('address', {
            })(<Input />)}
          </Form.Item>
          <Form.Item label="联系电话">
            {getFieldDecorator('phone', {
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
  
  const WrappedAccountForm = Form.create({ name: 'register' })(accountForm);
  
  export default WrappedAccountForm