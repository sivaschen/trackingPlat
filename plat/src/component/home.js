import React, { Component } from 'react';
import {Switch, Route } from 'react-router-dom'
import Monitor from '../component/monitor/monitor'
import Trace from '../component/trace/trace'
import { Menu, Icon, Button } from 'antd';

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="home">
       sssssssssss
       <Switch>
        <Route path="/home/monitor">
            <Monitor/>
        </Route>
        <Route path="/home/trace">
            <Trace/>
        </Route>
       </Switch>
      </div>
    )
  }
}


