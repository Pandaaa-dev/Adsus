const { Sequelize } = require('sequelize');
const mongoose = require("mongoose");
const chalk = require("chalk");

// Connecting to MongoDB
mongoose.connect(
  process.env.NOSQL_PATH,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (!err) return console.log(`${chalk.blue('Successfully connected to')} ${chalk.bold.blue('mongodb')}`);
    console.log(err);
  }
);

//  Connect to MYSQL
const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASS, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql'
});



module.exports = sequelize;

global.sequelize = sequelize