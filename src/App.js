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
  }

  //Function to control what is clicked on the left panel list
  Clicked = (current) => {
    let controlThis = this;
    this.state.markers.map(marker => {
      if(marker.id == current.key) {
        controlThis.addInfoWindow(marker, this.state.infowindow);
        controlThis.Flickr(current.name);
      }
    })
  }

  //Flickr api to get images from a selected query name
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
          <img tabindex={index+9} onClick={(e) => this.imageClicked(srcPath)} className="images" key={index} alt={"Image of " + name} src={srcPath} />
        )
      })
      this.setState({pictures: picArray});
    })
  }
  //Initialize the map and markers
  initMap= () => {
    let locations = this.state.locations;
    let markers = this.state.markers;
    let map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: { lat: 45.755374, lng: 21.228449 }
    });

    var infoWindow = new window.google.maps.InfoWindow();
    this.setState({infowindow: infoWindow});

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
        currentThis.Flickr(element.name);
      });
    });

    this.setState({ map: map });
  }

  //When the search input changes the markers display accordingly
  filterMarkers = (filteredArray) => {
    if(filteredArray != null){
      this.state.markers.map(marker => {
        marker.setMap(null);
        filteredArray.map(element => {
          if(element.key == marker.id) {
            marker.setMap(this.state.map);
          }
        })
      })
    }else{
      this.state.markers.map(marker => {
        marker.setMap(this.state.map)
      })
    }
  }

  //Add a infoWindow to display name and Streetview details and a clicked animation
  addInfoWindow = (marker, infowindow) => {
    infowindow.setContent('');
    infowindow.marker = marker;
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    marker.setAnimation(null);

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
    
    infowindow.setContent('<div>' + marker.title + '</div>')
    
    infowindow.open(this.state.map, marker);
  }

  //When an image is clicked it is displayed fullscreen
  imageClicked = (src) => {
    this.setState({imageClicked: true});
    this.setState({clickedImg: src});
  }

  //Button to hide the left panel functinality
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

  //Trigger when there is a click outside the fullscreen image displayed
  offClick = () => {
  this.setState({imageClicked: false})
  }

  //Main render function
  render() {
    return (
    <div>
      <Helmet>
          <title>Neighborhood Map</title>
          <meta name="description" content="Todos on steroid!" />
          <meta name="viewport" content="initial-scale=1, maximum-scale=1" />
        </Helmet>
      <div className="container">
      {/* When an image was clicked trigger it to display fullscreen */}
      {this.state.imageClicked ? 
      <InfoWindow offClick={this.offClick} src={this.state.clickedImg} />
      :
      <div></div>
      }
        <div id="map" role="application"></div>
          <input tabIndex="1" className="hide-button" onClick={this.HideFilter} type="button" value={this.state.filterHidden? 'Show Panel' : 'Hide Panel'} />
          <Filter pictures={this.state.pictures} clicked={this.Clicked} filterMarkers={this.filterMarkers} locations={this.state.locations}/>
      </div>
    </div>
    )
  }
}

export default App;
