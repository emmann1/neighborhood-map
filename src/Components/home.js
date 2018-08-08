import React, { Component } from 'react';
import Filter from './filter';
import '../App.css';

class Home extends Component {

    render() {
        return (
        <div className="container">
            <div id="map"></div>
                <Filter locations={this.props.locations}/>
        </div>
        )
    }
}

export default Home;