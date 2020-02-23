import React, {Component} from 'react'
export default class Monitor extends Component {
    constructor(props) {
      super(props)
      this.state = {
        
      }
    }
    componentDidMount () {        
        this.props.onRef('yjcenter', this);
        this.init();
    }
    init = () => {
        
    }
    render () {
        return (
            <a>sensor</a>
        )
    }
}