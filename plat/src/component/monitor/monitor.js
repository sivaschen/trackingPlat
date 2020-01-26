import React, { Component } from 'react';

export default class Monitor extends Component {
  init = () => {

  }
  componentDidMount () {
    // 调用父组件方法把当前实例传给父组件
      this.props.onRef('monitor', this)
  }
  onRef = () => {
      this.props.onRef('monitor', this)
  }
  render() {
    return (
      <div className="home">
        <header>monitoring</header>
        阿士大夫撒发士大夫撒发
      </div>
    )
  }
}
