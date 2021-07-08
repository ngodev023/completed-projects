// import react and react router
import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
//import styling
import './App.css';

// import home, search, Notfound, and Nav components from components folder
import SearchForm from './components/SearchForm.js'
import PhotoList from './components/PhotoList.js';
import Nav from './components/Nav.js';
import NotFound from './components/NotFound';

//import api key from a config file. 
//Change api_key variable to your own api key to use.
//Then delete import
import apiKey from './config.js';
//replace api_key variable value with your own key to use here
let api_key = apiKey;

//Primary wrapper component for web app
// Handles api fetch for data
// Renders and maintains 3 components: a searchbar, a nav component containing 3 default search options, and the display component
// Each search redirects browser to the /search/{query} url

class App extends Component{
  constructor() {
    super();
    this.state = {
      info: [],
      loading: true
    }
  }


  searchFeature = (search) => {
    this.setState({
      info: [],
      loading: true
    })
    fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${api_key}&tags=${search}&per_page=24&format=json&nojsoncallback=1`)
      .then(response => response.json())
      .then(responseData => {
        this.setState({
          info: responseData.photos.photo,
          loading: false
        })
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error)
      })
  }

 
// 2 of the 3 components are rendered at every route: the search bar and the 3 nav links,
// but user input search results (ie. the pictures) are only rendered at the /search/{query} url 
// 404 error page will be rendered if no matching patch is inputted.
  render(){
    return (
      <div className="container">
        <BrowserRouter>
        <Switch>
          <Route exact path="/" render={ ({history}) => <div>
                                                          <SearchForm 
                                                          onSearch={this.searchFeature} 
                                                          redir={history}
                                                          />
                                                          <Nav />
                                                        </div>} 
          />
          
          <Route  path="/search/:query" render={({history, match}) => <div>
                                                                        <SearchForm 
                                                                          onSearch={this.searchFeature} 
                                                                          redir={history}
                                                                        />
                                                                        <Nav />
                        

                                                                        <PhotoList 
                                                                          data={this.state.info} 
                                                                          memory={match.params.query} 
                                                                          fetch={this.searchFeature} 
                                                                          loadState={this.state.loading}
                                                                        />
                                                                       
                                                                     
                                                                        
                                                                      </div>
                                                                    } 
          />
          <Route component={NotFound} />  
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;
