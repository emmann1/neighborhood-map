import React, { Component } from 'react';
import './App.css';
import Filter from './Components/filter';
import InfoWindow from  './Components/infoWindow';
import * as markedLocations from './locations.json';

class App extends Component {

  state = {
    locations: markedLocations,
    map: '',
    markers: [],
    currentLocation: [],
    wikiInfo: [],
    markerClicked: false,
    pictures: []
  }

  //Load the map API and setting the global initMap as this components initMap
  componentDidMount() {
    
    window.initMap = this.initMap;
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBV0VFuM6WqVpdMx071AkSNbViOjeerMYI&callback=initMap";
    script.async = true;
    document.body.appendChild(script);
    script.onerror = function() {
      alert("Google Maps failed to load!");
    }
    this.setState({currentLocation: this.state.locations[0]})
    
  }

  Clicked = (current) => {
    this.setState({markerClicked: true});
    this.setState({currentLocation: current});
    this.Flickr(current.name);
  }

  Flickr = (name) => {
    const query = name.replace(/ /g,",");
    fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=38d745abed51adbd2be727af25d79bbf&tags='+ query +'&per_page=5&page=1&format=json&nojsoncallback=1')
    .then(function(response){
      return response.json();
    })
    .then(j => {
      let picArray = j.photos.photo.map((pic, index) => {
        
        var srcPath = 'https://farm'+pic.farm+'.staticflickr.com/'+pic.server+'/'+pic.id+'_'+pic.secret+'.jpg';
        return(
          <img key={index} alt="dogs" src={srcPath} />
        )
      })
      this.setState({pictures: picArray});
    })
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

  render() {
    return (
      <div className="container">
        <div id="map"></div>
        <div className="pictures">
        {this.state.pictures}
        </div>
          <Filter clicked={this.Clicked} locations={this.state.locations}/>
        </div>
    )
  }
}

export default App;
