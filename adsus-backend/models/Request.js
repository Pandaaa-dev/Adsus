
const sequelize = require('../db/db')
const { Sequelize, DataTypes } = require('sequelize')

module.exports = sequelize.define('Request', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
}, 
  uid: {
    type: DataTypes.INTEGER
  }, 
  amount: {
    type: DataTypes.INTEGER
  }, 
  currency: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING
  },
  created_at: {
    type: DataTypes.INTEGER,
    defaultValue: Date.now()
  }
})
 