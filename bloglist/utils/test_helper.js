const bcrypt = require('bcrypt')

const User = require('../models/user')
const Blog = require('../models/blog')

const log = require('./logger')

const h = {}

const testBlog = {
  _id: '5a422a851b54a676234d17f7',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  __v: 0
}

h.getAllUsers = async () => {
  const allUsers = await User.find({})
  return allUsers.map((u) => u.toJSON())
}

h.getUserById = async (id) => {
  const user = await User.findById(id)
  return user.toJSON()
}

h.getUsersByFilter = async (filter) => {
  const users = await User.find(filter)
  return users.map((u) => u.toJSON())
}

h.createTestBlog = async () => {
  const user = await User.findOne({})

  const blog = new Blog({
    ...testBlog,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
}

h.createTestUser = async () => {
  const passwordHash = await bcrypt.hash('porkkana', 10)

  const user = new User({
    username: 'test',
    passwordHash
  })

  await user.save()
}

module.exports = h
