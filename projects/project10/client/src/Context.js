import React, { Component } from 'react';
import Data from './Data';
import Cookies from 'js-cookie';

const Context = React.createContext(); 

// This class will mainly serve as a higher order component, wrapping around all other components to provide data such as:
// * the signIn method
// * the signOut method
// * the authenticated user info: email Address and password--to prevent having to repeatedly sign in
// its primary export is withContext, which can be used in App.js to wrap all the other components inside Provider context as an argument
export class Provider extends Component {

  // initiate the provider class with a space for cookies password and email address; initially set to null as there is no logged in user
  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    authenticatedPassword: Cookies.getJSON('authenticatedPassword') || null
  }
  constructor() {
    // the kernel of the Provider component; initiate a Data instance so that Consumers can access things like fetch requests for creating, updating, courses/users
    super();
    this.data = new Data();
  }

  render() {
    const {authenticatedUser, authenticatedPassword} = this.state;

    // The ability to sign in and out will be passed down to all children of Provider (subscribed ones) will be stored in the value object
    const value ={
      authenticatedUser,
      authenticatedPassword,
      data: this.data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut
      }
    }
    // render all compoents subscribed with access to value prop.
    // any component passed to withContext in App.js will have access to this class's value object via this.props.context--> value = props.context
    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  }

  // handles signing in
  signIn = async (emailAddress, password) => {
    // make a request to the db using provided signin info
    const response = await this.data.getUser(emailAddress, password); 
    // returns {firstName, lastName, emailAddress} or null if user isn't found

    
    let user;
    if(response.status === 200){
      // if there was successful login (200 status code) go about setting the authenticatedUser pw and email in state
       user = await response.json(); 
      this.setState(() => {
        return {
          authenticatedUser: user,
          authenticatedPassword: password
        }
      });
      // Set cookie for user and password
      Cookies.set('authenticatedUser', JSON.stringify(user), {expires: 1});
      Cookies.set('authenticatedPassword', JSON.stringify(password), {expires: 1});
    } 
    return response;
  }

  // simply set state's user and password back to null, and remove cookies
  signOut = () => {
    this.setState(() => {
      return {
        authenticatedUser: null,
        authenticatedPassword: null,
      };
    });
    Cookies.remove('authenticatedUser');
    Cookies.remove('authenticatedPassword');
  }
}

// for protecting private routes that need authentication to access. Visit PrivateRoute.js for more info
export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}

