import React, { Component } from 'react';
import '../App.css';

class InfoWindow extends Component {

    //Listen when a click was made outside the main image and trigger the state to change
    offClick = (e) => {
        let element = document.querySelector('.big-image img');
        if(!element.contains(e.target)){
            this.props.offClick();
        }
    }

    render() {
        return (
            <div onClick={(e) => this.offClick(e)} className="big-image">
                <img src={this.props.src} />
            </div>
        )
    }

}

export default InfoWindow