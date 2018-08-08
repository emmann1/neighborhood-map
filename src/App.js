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
    const script = document.createElement("script");

        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBV0VFuM6WqVpdMx071AkSNbViOjeerMYI&callback=initMap";
        script.async = true;

        document.body.appendChild(script);

    
  }

  initMap= () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: { lat: 45.756605, lng: 21.229135 }
    });

    /* Keep state in sync */
    this.setState({ map: map });
  }

  render() {
    return (
      <Home />
    );
  }
}

export default App;
