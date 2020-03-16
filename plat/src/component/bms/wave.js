import React from 'react'
import './wave.scss'

export default class Wave extends React.Component {
    constructor (props){
        super(props);
    }

    // renderWave = () => {
    //     var waveHeight=0;
    //     var waveNum=61;
    //     function waves(){
    //             if (waveHeight<waveNum){
    //                 $(".wave").css("height", waveHeight+"%");
    //                 waveHeight++;
    //             }
    //             setTimeout(function() { waves() },15)	;
    //         }
    
    //     $(function(){
    //             $("#denfenjs").html(waveNum+"%");
    //              waves();
    //         })
    // }
    render () {
        let {socPercentage} = this.props;
        let height = {height: 10 + (socPercentage * 130 / 100) + "px"}
        return (
            // <div className="fensug">
            //     <div className="wavenum "><b id="denfenjs">{socPercentage + "%"}</b><tt>SOC</tt></div>
            //     <div className="waven"> </div>
            //     <div className="wave" style={height}>&nbsp;</div>
            // </div>
            <div className="wave1">
                <div className="box">
                    <div className="circle"></div>
                    <div className="waveBox">
                        <div className="wave" style={height}></div>
                        <span className="value">{(socPercentage || 0) + '%'}</span>
                    </div>
                </div>
            </div>
        )
    }
}