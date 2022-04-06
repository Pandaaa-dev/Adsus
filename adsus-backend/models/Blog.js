const sequelize = require('../db/db')
const { Sequelize, DataTypes } = require('sequelize')

module.exports = sequelize.define('Blog', {
  title: {
    type: DataTypes.STRING
  }, 
  date: {
    type: DataTypes.STRING
  }, 
  blogText: {
    type: DataTypes.INTEGER
  }, 
  added_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
})
 