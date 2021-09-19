const sequelize = require('../db/db')
const { Sequelize, DataTypes } = require('sequelize')

module.exports = sequelize.define('Card', {
  type: {
    type: DataTypes.STRING
  }, 
  location: {
    type: DataTypes.STRING
  }, 
  uid: {
    type: DataTypes.STRING,
    defaultValue: null,
    require: true
  },
  amount: {
    type: DataTypes.INTEGER
  }, 
  currency: {
    type: DataTypes.STRING
  },
  code: {
    type: DataTypes.STRING
  },
  expiration: {
    type: DataTypes.DATE
  }, 
  status : {
    type: DataTypes.STRING
  }, 
  added_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
})
 