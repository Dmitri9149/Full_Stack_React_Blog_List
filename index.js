const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const logger = require('./utils/logger')
const config = require('./utils/config')

logger.info('connecting.to', config.MONGODB_URI)

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

/* const mongoUrl = 'mongodb+srv://blog_list:1961dm20XX@cluster0.2m41j.mongodb.net/blog_list?retryWrites=true&w=majority' */
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

app.use(cors())
app.use(express.json())



const PORT = 3003
app.listen(config.PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
