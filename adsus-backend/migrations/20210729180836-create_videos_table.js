'use strict';
const {DataTypes} = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('videos', {
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
  },

  down: async (queryInterface, Sequelize) => {
  
    return queryInterface.dropTable('videos');
  }
};
