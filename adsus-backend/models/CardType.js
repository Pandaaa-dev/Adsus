const sequelize = require('../db/db')
const { Sequelize, DataTypes } = require('sequelize')

module.exports = sequelize.define('CardType', {
  type: {
    type: DataTypes.STRING
  }, 
  location: {
    type: DataTypes.STRING
  }, 
  amount: {
    type: DataTypes.INTEGER
  }, 
  currency: {
    type: DataTypes.STRING
  },
  quantity: {
    type: DataTypes.INTEGER
  },
  status : {
    type: DataTypes.STRING
  }, 
  added_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
})
 