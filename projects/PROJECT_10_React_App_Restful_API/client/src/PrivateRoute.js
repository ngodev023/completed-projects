import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './Context';

// This component generates a route component, with will only allow access if context. authenticatedUser has a value: line 12
const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Consumer>
      { context => (
        <Route
          {...rest}
          render={ props => context.authenticatedUser ? (
              <Component {...props} />
            ) : (
              <Redirect to={{
                pathname: '/signin',
                state: {from: props.location}
              }} />
            )
          
          }
        />
      )}
    </Consumer>
  );
};

export default PrivateRoute;