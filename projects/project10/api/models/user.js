'use strict';

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Model {}
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First name required'
                },
                notEmpty: {
                    msg: 'Please provide first name'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Last name required'
                },
                notEmpty: {
                    msg: 'Please provide last name'
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false ,
            unique: {
              msg: 'The email you entered already exists'
            },
            validate: {
              notNull: {
                msg: 'An email is required'
              },
              isEmail: {
                msg: 'Please provide a valid email address'
              }
            }
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notNull: {
                msg: 'A password is required'
              },
              notEmpty: {
                msg: 'Please provide a password'
              },
              set(val){
                if (val.length >= 8 && val.length <= 20) {
                  this.setDataValue('password', bcrypt.hashSync(val, 10));
                } else {
                  const err = new Error("Your password should be between 8-20 characters");
                  err.status = 400;
                  err.name = 'SequelizeValidationError';
                  throw err;
                }
              }
            },
            
          }
    }, {sequelize});

    User.associate = (models) => {
        User.hasMany(models.Course, {
          as: 'user',
          foreignKey: 'userId'
      })
    }

    return User;
}