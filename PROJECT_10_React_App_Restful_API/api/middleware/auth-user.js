'use strict';

const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

const authenticateUser = async (req, res, next) => {
    let message;

    const credentials = auth(req); // credentials = {name: 'vince@hitmail.com', pass: 'hello123456'}
 
    if (credentials.name && credentials.pass) {
        const user = await User.findOne({ attributes:{exclude: ['createdAt', 'updatedAt']}, where: {emailAddress: credentials.name} });
        if (user) {
        
        const authenticated = bcrypt.compareSync(credentials.pass, user.password);

        if (authenticated) {
            console.log(`Authentication successful for username: ${user.emailAddress}`);
            // delete password from response body so it doesn't show
            delete user.dataValues.password;
            // Store the user on the Request object.
            req.currentUser = user;
        } else {
            message = `Incorrect password for: ${user.emailAddress}`;
        }
        } else {
        message = `${credentials.name} account not found. Please sign up for an account.`;
        }
    } else {
        message = 'Please supply Login information';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: message });
      } else {
        next();
     }

  
  };

  module.exports = authenticateUser;