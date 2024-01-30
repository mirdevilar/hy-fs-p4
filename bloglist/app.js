const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const blogsRouter = require('./controllers/blogs')

const Blog = require('./models/blog')

const cfg = require('./utils/config')
const log = require('./utils/logger')

const app = express()

const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
}

mongoose.connect(cfg.MONGODB_URI)
  .then(() => {
    log.info('connected to MongoDB')
  })
  .catch((error) => {
    log.err('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.use(cfg.BLOGS_API_ROOT, blogsRouter)

app.use(errorHandler)

module.exports = app
