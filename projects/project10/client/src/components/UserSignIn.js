import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

// user signin page
export default class UserSignIn extends Component {
  // initiate the following properties in state: simple required login info, and errors to be filled if any arise
  state = {
    emailAddress: '',
    password: '',
    errors: [],
  }

  // keeps track of user typing and updating the input fields in real time
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  render() {
    // destructure the inputs for ease of use
    const {
      emailAddress,
      password,
      errors,
    } = this.state;

    // A Form component has been imported to make form rendering easier--check out Form.js for more info
    return (
      <main>
        <div className="form--centered">
            <h2>Sign In</h2>
            <Form 
              cancel={this.cancel}
              errors={errors}
              submit={this.submit}
              submitButtonText="Sign In"
              elements={() => (
                <React.Fragment>
                  <input 
                    id="emailAddress" 
                    name="emailAddress" 
                    type="text"
                    value={emailAddress} 
                    onChange={this.change} 
                    placeholder="Email Address" />
                  <input 
                    id="password" 
                    name="password"
                    type="password"
                    value={password} 
                    onChange={this.change} 
                    placeholder="Password" />                
                </React.Fragment>
              )} />
            <p>
              Don't have a user account? <Link to="/signup">Click here</Link> to sign up!
            </p>
        </div>
      </main>
    );
  }

  
  // user hitting logging in button will execute the following protocol
  submit = async () => {
    // this is essentially the value props passed down, linked to a Data instance that serves as a connection to the api folder
    const {context} = this.props; 

    // allows browser to go back if user had been redirected
    const {from} = this.props.location.state || {from: {pathname: '/'}};

    // destructures email and password inputs for ease of use
    const {emailAddress, password} = this.state;
    
    // this response variable is asynchronous, making a call to the api db to see if user has successfully logged in or not
    const response = await context.actions.signIn(emailAddress, password)
    
    if(response.status !== 200 && response.status !== 500) {
      // for whatever reason, response isn't 200, the only acceptable response, populate errors prop in state so component can render it to user
      const errors = await response.json();
      this.setState({
        errors: [errors.message]
      })
      } else if (response.status === 500) {
        this.props.history.push('/error');
      }else {
        // otherwise, it must be 200 status... redirect user back to wherever user had been trying to get to
        this.props.history.push(from);
      }

  }

  // Goes back to courses main page
  cancel = () => {
    this.props.history.push('/');
  }
}
