'use strict';
const { Model, DataTypes } = require('sequelize');
//const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class Course extends Model {}
    Course.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Title required'
                },
                notEmpty: {
                    msg: 'Please provide a title for the course'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Description required'
                },
                notEmpty: {
                    msg: 'Please provide a description for the course'
                },
                len: {
                    args: [10,],
                    msg: 'The description should be at least 10 characters in length'
                }
            }
        },
        estimatedTime: {
          type: DataTypes.STRING
        },
        materialsNeeded: {
          type: DataTypes.STRING
        }
    }, {sequelize});

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId'
        })
    }

    return Course;
}