//引入react jsx写法的必须
import React from 'react'; 
//引入需要用到的页面组件 
import Home from './component/home';
import About from './component/about';
import Login from './component/login';

//引入一些模块
import { Route, Switch} from "react-router-dom";


function router(){
    return (
        <Switch>
            <Route path="/home" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/" component={Login} />
        </Switch>
    );
    }
    
    export default router;