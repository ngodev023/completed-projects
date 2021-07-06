import React from 'react';
import { Link } from 'react-router-dom';

// This header component will linger above each route in the program, and will display user or lackthereof based on inform it extracts from Context.js
// Header is a stateless component, so access of props is simply props, not this.props
// Header will display signup and signin if user is not signed in; and signout if user is already signed in
const Header = (props) => {
  
    // getting the authentication status from Provider component
    const {context} = props;
    const authUser = context.authenticatedUser;
    return (
      <header>
        <div className="wrap header--flex">
          <h1 className="header--logo"><Link to="/">Courses</Link></h1>
          <nav>
            {authUser ?
              (
                <ul className="header--signedin">
                  <li><span>Welcome, {authUser.firstName} {authUser.lastName}!</span></li>
                  <li><Link to="/signout">Sign Out</Link></li>
                </ul>
              )
              :
              (
                <ul className="header--signedout">
                  <li><Link to="/signup">Sign Up</Link></li>
                  <li><Link to="/signin">Sign In</Link></li>
                </ul>
              )
              }
            </nav>
        </div>
      </header>
      
    );
  };

  export default Header;