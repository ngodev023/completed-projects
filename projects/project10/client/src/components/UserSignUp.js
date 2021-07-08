import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

// Looks like user wants to join the party...
export default class UserSignUp extends Component {

  // initiate the following properties in state... essentially the required information for signing up as a new user.
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmedPassword: '',
    errors: []
  }

  render() {
    // destructure the state's properties for ease of use
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmedPassword,
      errors,
    } = this.state;

    // a Form component had been imported for easier form rendering; pass in this instance's methods as props
    return (
      <main className="bounds">
        <div className="form--centered">
          <h2>Sign Up</h2>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            elements={() => (
              <React.Fragment>
                <input 
                  id="firstName" 
                  name="firstName" 
                  type="text"
                  value={firstName} 
                  onChange={this.change} 
                  placeholder="First Name" />
                <input 
                  id="lastName" 
                  name="lastName" 
                  type="text"
                  value={lastName} 
                  onChange={this.change} 
                  placeholder="Last Name" />
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
                <input 
                  id="confirmedPassword" 
                  name="confirmedPassword"
                  type="password"
                  value={confirmedPassword} 
                  onChange={this.change} 
                  placeholder="Confirm Password" />
              </React.Fragment>
            )} />
          <p>
            Already have a user account? <Link to="/signin">Click here</Link> to sign in!
          </p>
        </div>
      </main>
    );
  }
  
  // changes the inputs' displays as user types in real time
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }
  
    // cancel button 
  cancel = () => {
    this.props.history.push('/');
  }

  // submit function--takes ipnuts and uses api method in Data.js to be stored in database
  // then logs users in and redirects them to previous page they were on... assuming everything went well.
  submit = async () => {
    // stuff passed down from the Provider component, such as the ability to make requests to the api folder; store it in its own variable for ease of use
    const {context} = this.props;
    
    // stuff currently in the state property... essentially the user inputs; destructured for ease of use
    const {firstName, lastName, emailAddress, password, confirmedPassword} = this.state;

    // putting the user input data into one neat package called user.
    // This is essentially going to serve as the body of the request normally used in Postman.
    const user = {firstName, lastName, emailAddress, password};

    // user needs to be certain of his/ her password
    // only submit if password and confirm password matches up
    // and only if the password field isn't blank
    if(password && (password === confirmedPassword)) {
      // call to api once the necessary data had been provided to see if user can be created with given info
      const response = await context.data.createUser(user);

      // there was a response, let's check it ouf...
      try {
        if (response.status === 201){
          // if all goes well--> initiate a login for user, by accessing context's signIn method
          // Then it's back to courses listing
          await context.actions.signIn(emailAddress,password);
          this.props.history.push('/');
        } else if(response.status === 400) {
          // validation errors were returned by api
          // change the errors property in state from a blank array, so component can render it to user
          const errors = await response.json();
          this.setState({
            errors: errors.errors
          });
        } else if (response.status === 500){
          // the db is not working properly
          this.props.history.push('/error');
        }
      } catch (error) {
        // cannot send request for whatever reason
        this.props.history.push('/error');
      }
    } else {
      // request shouldn't be sent at all if passwords don't match or is blank
      this.setState({
        errors: ["Please make sure password and confirm password are a match"]
      })
    }
  }  
}
