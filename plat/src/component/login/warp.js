import React, {Component} from 'react'
// import WarpSpeed from "./warpSpeed.js"
import Jqwar from './jqwar.js'
import './warp.scss'
var settings = {
              width:500,
              height: 720,
              autoResize:true,
              autoResizeMinWidth: 750,
              autoResizeMaxWidth: "100%",
              autoResizeMinHeight: 300,
              autoResizeMaxHeight:"100%",
              addMouseControls: false,
              addTouchControls: false,
              hideContextMenu: true,
              starCount: 7777,
              starBgCount: 0,
              starBgColor: {r: 0, g: 204, b: 255},
              starBgColorRangeMin: 10,
              starBgColorRangeMax: 100,
              starColor: {r: 0, g: 204, b: 255},
              starColorRangeMin: 50,
              starColorRangeMax: 100,
              starfieldBackgroundColor: {r: 5, g: 5, b: 14},
              starDirection: 1,
              starSpeed: 20,
              starSpeedMax: 100,
              starSpeedAnimationDuration: 5,
              starFov: 300,
              starFovMin: 200,
              starFovAnimationDuration: 2,
              starRotationPermission: true,
              starRotationDirection: 1,
              starRotationSpeed: 0.0,
              starRotationSpeedMax: 1.0,
              starRotationAnimationDuration: 2,
              starWarpLineLength: 1.0,
              starWarpTunnelDiameter: 800,
              starFollowMouseSensitivity: 0.05,
              starFollowMouseXAxis: false,
              starFollowMouseYAxis: false
            };
export default class WarpAni extends Component {
    constructor(props) {
      super(props);
      this.state = {
        
      }
    };
    componentDidMount () {
        var warpdrive = Jqwar(document.getElementById('warp'), settings);
        let warpDom = document.getElementById('warp');

    }
    render () {
        return (
            // <div className="canvasBox"><canvas id="warpSpeed"></canvas></div>
            <div id='warp'></div>
        )
    }
}