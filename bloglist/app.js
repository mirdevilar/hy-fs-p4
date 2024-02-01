const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

require('express-async-errors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const cfg = require('./utils/config')
const log = require('./utils/logger')
const middleware = require('./utils/middleware')

const app = express()

mongoose.connect(cfg.MONGODB_URI)
  .then(() => {
    log.info('connected to MongoDB')
  })
  .catch((error) => {
    log.err('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(cfg.BLOGS_API_ROOT, middleware.tokenExtractor)
app.use(cfg.BLOGS_API_ROOT, middleware.userExtractor)

app.use(cfg.BLOGS_API_ROOT, blogsRouter)
app.use(cfg.USERS_API_ROOT, usersRouter)
app.use(cfg.LOGIN_API_ROOT, loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
