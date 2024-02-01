require('dotenv').config()

const { PORT } = process.env

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const BLOGS_API_ROOT = '/api/blogs/'
const USERS_API_ROOT = '/api/users/'
const LOGIN_API_ROOT = '/api/login/'

module.exports = {
  MONGODB_URI,
  PORT,
  BLOGS_API_ROOT,
  USERS_API_ROOT,
  LOGIN_API_ROOT,
}
