import React, { Component } from 'react';
import '../App.css';

class Filter extends Component {
    state = {
        searchQuery: '',
        filteredLocations: this.props.locations,
        filterHidden: false
    }

    //Set the query that is being used for searching ht locations
    setQuery = (string) => {
        this.setState({searchQuery : string.toLowerCase()}, this.Search);
    }

    // Search locations with a query and return a filtered array of those locations that are being then sent back to main app
    // to filter the markers further
    Search = () => {
        if(this.state.searchQuery != '') {
            let filteredLocations = this.props.locations.filter(el => el.title.toLowerCase().includes(this.state.searchQuery))
            this.setState({filteredLocations: filteredLocations})
            this.props.filterMarkers(filteredLocations);
        }else{
            this.setState({filteredLocations: this.props.locations})
            this.props.filterMarkers(null);
        }
    }

    render() {
        return(
            <div className="filter-container">
                <div className="filter">
                    
                    <input tabIndex="1" value={ this.state.searchQuery } 
                    onChange={event => this.setQuery(event.target.value)}
                    id="search-input" type="text" placeholder="Search for a place..." />
                    <ul className="locations-list">
                        {
                            this.state.filteredLocations.map((element, index) => (
                            <li role="button" onClick={(e) => this.props.clicked(element)} 
                            tabIndex={index+2} className="list-item" key={ element.key }>{ element.title }</li>))
                        }
                    </ul>
                </div>
                <div className="pictures">
                    {this.props.pictures}
                </div>
            </div>
        )
    }
}

export default Filter