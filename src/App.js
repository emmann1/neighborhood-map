import React, { Component } from 'react';
import './App.css';
import Home from  './Components/home';
import InfoWindow from  './Components/infoWindow';
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

  //initialize the map and markers
  initMap= () => {
    let locations = this.state.locations;
    let markers = this.state.markers;
    let map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: { lat: 45.755374, lng: 21.228449 }
    });

    //Loops through every location to set a marker for it
    locations.forEach( element => {
      let position = element.position;
      let name = element.title;
      let id = element.key;

      let marker = new window.google.maps.Marker({
        map: map,
        position: position,
        title: name,
        id: id,
        animation: window.google.maps.Animation.DROP
      });

      markers.push(marker);
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
