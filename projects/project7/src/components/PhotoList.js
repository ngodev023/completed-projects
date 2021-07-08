import React, {Component} from 'react';
import Photo from './Photo.js';
import NoResults from './NoResults.js';

class PhotoList extends Component {
    //component will keep track of {match} data passed through in props--labeled as props.memory
    //comparing current props to previous state of props upon each update will allow for 
    //repeated api calls upon use of browser buttons: forward, back, or reset
    componentDidMount(){
        this.props.fetch(this.props.memory);
    }
    componentDidUpdate(prevProps){
        if(this.props.memory !== prevProps.memory){
            this.props.fetch(this.props.memory);
        }
        
    }

    //component will render by mapping through data passed in through props, rendering a Photo comp for each item... or the NoResults component which handles both loading and no actual results.
     render(){
        if(this.props.data.length > 0) { 
            return (
                <div  className="photo-container">
                    <h2>Results</h2>
                    <ul>
                        {this.props.data.map( obj => (
                            <Photo key={obj.id} data={obj}/>
                        ))}    
                    </ul>
                </div>
            )
        } else { 
            return <NoResults loadState={this.props.loadState}/>
        }

    }
}

export default PhotoList;