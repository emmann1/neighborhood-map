import React, { Component } from 'react';
import '../App.css';

class Home extends Component {
    render() {
        return (
        <div className="container">
            <div id="map"></div>
            <div className="filter">
                <input type="text" placeholder="Search for a place..." />
                <ul className="locations-list">
                        {
                            this.props.locations.map(element => (
                                <li className="list-item" key={ element.key }> { element.title } </li>
                            ))
                        }
                </ul>
            </div>
        </div>
        )
    }
}

export default Home;