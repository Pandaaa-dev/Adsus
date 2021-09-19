'use strict';
const {DataTypes} = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('cards', {
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
  },

  down: async (queryInterface, Sequelize) => {
  
    return queryInterface.dropTable('cards');
     
  }
};
