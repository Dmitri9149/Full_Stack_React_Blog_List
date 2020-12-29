const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const logger = require('./utils/logger')
const config = require('./utils/config')

logger.info('connecting.to', config.MONGODB_URI)


/* const mongoUrl = 'mongodb+srv://blog_list:1961dm20XX@cluster0.2m41j.mongodb.net/blog_list?retryWrites=true&w=majority' */
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

app.use(cors())
app.use(express.json())

module.exports = app