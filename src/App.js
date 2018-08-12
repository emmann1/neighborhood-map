import React, { Component } from 'react';
import './App.css';
import Filter from './Components/filter';
import InfoWindow from  './Components/infoWindow';
import * as markedLocations from './locations.json';
import { Helmet } from 'react-helmet'

class App extends Component {

  state = {
    locations: markedLocations,
    map: '',
    markers: [],
    currentLocation: [],
    markerClicked: false,
    pictures: [],
    filterHidden: false,
    imageClicked: false,
    clickedImg: '',
    height: ''
  }

  //Load the map API and setting the global initMap as this components initMap
  componentDidMount() {
    this.setState({height: window.innerHeight});
    
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
    const query = name;
    let mobile = this.state.height > 700 ? '_c' : '';
    fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=38d745abed51adbd2be727af25d79bbf&text='+ query +'&per_page=10&page=1&format=json&nojsoncallback=1')
    .then(function(response){
      return response.json();
    })
    .then(j => {
      let picArray = j.photos.photo.map((pic, index) => {
        
        var srcPath = 'https://farm'+pic.farm+'.staticflickr.com/'+pic.server+'/'+pic.id+'_'+pic.secret+ mobile + '.jpg';
        return(
          <img onClick={(e) => this.imageClicked(srcPath)} className="images" key={index} alt="dogs" src={srcPath} />
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
      zoom: 14,
      center: { lat: 45.755374, lng: 21.228449 }
    });

    var infoWindow = new window.google.maps.InfoWindow();

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

      let currentThis = this;

      marker.addListener('click', function() {
        currentThis.addInfoWindow(this, infoWindow, element);
      });
    });

    this.setState({ map: map });
  }

  addInfoWindow = (marker, infowindow, location) => {
    infowindow.setContent('');
    infowindow.marker = marker;
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });

    var streetViewService = new window.google.maps.StreetViewService();
          var radius = 50;
          function getStreetView(data, status) {
            if (status == window.google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = window.google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
                infowindow.setContent('<div class="info-title">' + marker.title + '</div><div id="street"></div>');
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
              var panorama = new window.google.maps.StreetViewPanorama(
                document.getElementById('street'), panoramaOptions);
            } else {
              infowindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
            }
          }
          // Use streetview service to get the closest streetview image within
          // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    this.Clicked(location);
    infowindow.setContent('<div>' + marker.title + '</div>')
    
    infowindow.open(this.state.map, marker);
  }

  imageClicked = (src) => {
    this.setState({imageClicked: true});
    console.log(src);
    this.setState({clickedImg: src});
    console.log(this.state.height);
  }

  HideFilter = () => {
    let filter = document.querySelector('.filter-container');
    if(this.state.filterHidden){
        this.setState({filterHidden: false});
        filter.classList.remove('hide');
    }else{
        this.setState({filterHidden: true});
        filter.classList.add('hide');
    }
  }

  offClick = () => {
  this.setState({imageClicked: false})
  }

  render() {
    return (
    <div>
      <Helmet>
          <title>Neighborhood Map</title>
          <meta name="description" content="Todos on steroid!" />
          <meta name="viewport" content="initial-scale=1, maximum-scale=1" />
        </Helmet>
      <div className="container">
      {this.state.imageClicked ? 
      <InfoWindow offClick={this.offClick} src={this.state.clickedImg} />
      :
      <div></div>
      }
        <div id="map"></div>
          <input className="hide-button" onClick={this.HideFilter} type="button" value={this.state.filterHidden? 'Show Panel' : 'Hide Panel'} />
          <Filter pictures={this.state.pictures} clicked={this.Clicked} locations={this.state.locations}/>
      </div>
    </div>
    )
  }
}

export default App;
