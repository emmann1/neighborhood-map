import React, { Component } from 'react';
import './App.css';
import fetchJsonP from 'fetch-jsonp';
import Home from  './Components/home';
import InfoWindow from  './Components/infoWindow';
import * as markedLocations from './locations.json';

class App extends Component {

  state = {
    locations: markedLocations,
    map: '',
    markers: [],
    selectedMarker: '',
    wikiInfo: [],
    markerClicked: false
  }

  //Load the map API and setting the global initMap as this components initMap
  componentDidMount() {
    this.fetchWiki();
    window.initMap = this.initMap;
    const script = document.createElement("script");

        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBV0VFuM6WqVpdMx071AkSNbViOjeerMYI&callback=initMap";
        script.async = true;

        document.body.appendChild(script);

        script.onerror = function() {
          alert("Google Maps failed to load!");
        }

        

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

    this.setState({ map: map });
  }

  fetchWiki = () => {
    console.log(this.state.locations);
    for(let el of this.state.locations) {
      let url = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&titles=' + el.title;
      url = url.replace(/ /g, '%20');
      fetchJsonP(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
    }
  }

  render() {
    return (
      <Home locations={ this.state.locations }/>
    );
  }
}

export default App;
