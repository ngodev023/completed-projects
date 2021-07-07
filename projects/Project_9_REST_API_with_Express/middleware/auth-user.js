'use strict';

const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

// This middleware will check whether or not submitted credentials match a user in the db

const authenticateUser = async (req, res, next) => {
    // create error message variable to store any that should arise
    let message;

    // basic auth module will parse the authorization info sent in request headers...
    const credentials = auth(req); // Ex. credentials = {name: 'vince@hitmail.com', pass: 'hello123456'}
    
    // if auth was successful in parsing; essentially if it's not undefined
    if (credentials) {
        // User model will try to locate a user with an emailAddress matching the credential name
        const user = await User.findOne({ attributes:{exclude: ['createdAt', 'updatedAt']}, where: {emailAddress: credentials.name} });

        // if a user's emailAddress matches the name credential, proceed...
        if (user) {
            
            // use bcrypt to compare the hashed headers pass to the stored password for such account 
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            
            // if bcrypt returns a true value, proceed...
            if (authenticated) {
                console.log(`Authentication successful for username: ${user.emailAddress}`);
                // delete password from response body so it doesn't show in response
                delete user.dataValues.password;
                // Store the user on the request object as a property called currentUser
                req.currentUser = user;
            } else {
                // if incorrect password, fill the message variable with...
                message = `Incorrect password for: ${user.emailAddress}`;
            }
        } else {
            // fill message/ error message variable with ... no matching account is found 
            message = `${credentials.name} account not found. Please sign up for an account.`;
        }
    } else {
        // obviously, the invoked route requires login; fill variable with this message if authorization wasn't sent or failed
        message = 'Please supply Login information';
    }

    // finally, if the message variable contains any value, there are errors...
    // log out error messages, and respond with same message
    if (message) {
        console.warn(message);
        res.status(401).json({ message: message });
      } else {
        // if there is no message, then login was successful, proceed within the route handler
        next();
     }

  
  };

  module.exports = authenticateUser;