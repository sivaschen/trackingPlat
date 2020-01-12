import React, { Component } from 'react';
import {Link, Switch, Route, useRouteMatch, useParams} from "react-router-dom"
function Topic() {
  // The <Route> that rendered this component has a
  // path of `/topics/:topicId`. The `:topicId` portion
  // of the URL indicates a placeholder that we can
  // get from `useParams()`.
  let { topicId } = useParams();

  return (
    <div>
      <h3>{topicId}</h3>
    </div>
  );
}
export default function Trace(params) {
    let { path, url } = useRouteMatch();
    return (
      <div className="home">
        <header>trace</header>
        <ul>
        <li>
          <Link to={`${url}/rendering`}>Rendering with React</Link>
        </li>
        <li>
          <Link to={`${url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>
         <Switch>
         <Route exact path={path}>
           <h3>Please select a topic.</h3>
         </Route>
         <Route path={`${path}/:topicId`}>
           <Topic />
         </Route>
       </Switch>
      </div>
    )
  }
