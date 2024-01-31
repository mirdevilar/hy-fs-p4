const User = require('../models/user')

const getAllUsers = async () => {
  const allUsers = await User.find({})
  return allUsers.map((u) => u.toJSON())
}

const getUserById = async (id) => {
  const user = await User.findById(id)
  return user.toJSON()
}

const getUsersByFilter = async (filter) => {
  const users = await User.find(filter)
  return users.map((u) => u.toJSON())
}

module.exports = { getAllUsers, getUserById, getUsersByFilter }
