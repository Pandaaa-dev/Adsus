'use strict';
const {DataTypes} = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('requests', {
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
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
  
    return queryInterface.dropTable('requests');
     
  }
};
