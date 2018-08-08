import React, { Component } from 'react';
import './App.css';
import Home from  './Components/home';
import * as markedLocations from './locations.json';

class App extends Component {

  state = {
    locations: markedLocations,
    map: '',
    markers: [],
    currentMarker: ''
  }

  //Load the map API and setting the global initMap as this components initMap
  componentDidMount() {
    window.initMap = this.initMap;
    Load('https://maps.googleapis.com/maps/api/js?key=AIzaSyBV0VFuM6WqVpdMx071AkSNbViOjeerMYI&callback=initMap');
  }

  initMap() {

  }

  render() {
    return (
      <Home />
    );
  }
}

export default App;
