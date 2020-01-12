import React, { Component } from 'react';
import {Switch, Route, useRouteMatch } from 'react-router-dom'
import Monitor from '../component/monitor/monitor'
import Trace from '../component/trace/trace'

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
        <header>homepage</header>
        <nav></nav>
        <Switch>
          <Route exac path="/home/monitor" >
            <Monitor/>
          </Route>
          <Route>
            <Trace/>
          </Route>
        </Switch>
      </div>
    )
  }
}
