const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const Blog = require('./models/blog')

const cfg = require('./utils/config')
const log = require('./utils/logger')

const app = express()

mongoose.connect(cfg.MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use(cfg.BLOGS_API_ROOT, blogsRouter)

module.exports = app
