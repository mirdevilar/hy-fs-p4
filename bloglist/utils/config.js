require('dotenv').config()

const { MONGODB_URI, PORT } = process.env
const BLOGS_API_ROOT = '/api/blogs/'

module.exports = {
  MONGODB_URI,
  PORT,
  BLOGS_API_ROOT,
}
