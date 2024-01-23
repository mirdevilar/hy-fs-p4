const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Blog = require('./models/blog')

const cfg = require('./utils/config')
const log = require('./utils/logger')

const app = express()

mongoose.connect(cfg.MONGODB_URI)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then((blogs) => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then((result) => {
      response.status(201).json(result)
    })
})

module.exports = app
