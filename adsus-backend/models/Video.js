
const sequelize = require('../db/db')
const { Sequelize, DataTypes } = require('sequelize')

module.exports = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement:true,
  }, 
  file_path: {
    type: DataTypes.STRING
  }, 
  points: {
    type: DataTypes.INTEGER
  },
  expiration_date: {
    type: DataTypes.DATE,
  }, 
  company: {
    type: DataTypes.STRING
  },
  count: {
    type: DataTypes.INTEGER
  }, 
  added_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
})
 