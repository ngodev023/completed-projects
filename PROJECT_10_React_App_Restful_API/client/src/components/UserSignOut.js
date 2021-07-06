import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const UserSignOut = ({context}) => {
  // normally, it's context.actions.signOut(), but useEffect prevents a warning.
  useEffect(() => context.actions.signOut());

  return (
    <Redirect to="/" />
  );
}

export default UserSignOut;