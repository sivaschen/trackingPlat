//引入react jsx写法的必须
import React, {Component} from 'react'; 
//引入需要用到的页面组件 
import Login from './component/login/login';
import Home from './component/home'
import Playback from './component/playback/playback.js'
import {Switch, Route} from 'react-router-dom'

const routes = [
    {
        path: "/login",
        component: Login
    },
    {
        path: "/home",
        component: Home
    },
    {
      path: "/playback",
      component: Playback
    },
    {
        path: "/*",
        component: Login
    }
];

export default class Router extends Component {
    constructor(props) {
      super(props)
      this.state = {
  
      }
    }
    componentDidMount() {
    }
    render() {
      return (
          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
      )
    }
}
function RouteWithSubRoutes(route) {
    return (
      <Route
        path={route.path}
        render={props => (
          // pass the sub-routes down to keep nesting
          <route.component {...props} routes={route.routes} />
        )}
      />
    );
  }
