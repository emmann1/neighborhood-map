import React, { Component } from 'react';
import '../App.css';

class Filter extends Component {
    state = {
        searchQuery: '',
        filteredLocations: this.props.locations
    }

    setQuery = (string) => {
        this.setState({searchQuery : string}, this.Search);
    }

    Search = () => {
        if(this.state.searchQuery != '') {
            let filteredLocations = this.props.locations.filter(el => el.title.toLowerCase().includes(this.state.searchQuery))
            this.setState({filteredLocations: filteredLocations})
        }else{
            this.setState({filteredLocations: this.props.locations})
        }
    }

    render() {
        return(
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
        )
    }
}

export default Filter