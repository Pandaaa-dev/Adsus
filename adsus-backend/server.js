require('dotenv').config()
const fs = require('fs')
const express = require('express')
const app = express()
require('./db/db')

const cookieParser = require('cookie-parser')
const chalk = require('chalk')

const CardRoutes = require('./routes/CardRoutes/routes')
const RequestCardRoutes = require('./routes/RequestRoutes/routes')
const UserRoutes = require('./routes/UserRoutes/routes')
const VideoRoutes = require('./routes/VideoRoutes/routes')

app.use(cookieParser());
app.use(express.json()); 

// Using all the routes
app.use('/card', CardRoutes)
app.use('/requestcards', RequestCardRoutes)
app.use('/user', UserRoutes)
app.use('/video', VideoRoutes)

app.listen(process.env.PORT, () => {
  console.log(chalk.blue('Successfully running on ') + chalk.bold.blue(` ${process.env.PORT}`))
})