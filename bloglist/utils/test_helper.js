const User = require('../models/user')

const getAllUsers = async () => {
  const allUsers = await User.find({})
  return allUsers.map((u) => u.toJSON())
}

const getUserById = async (id) => {
  const user = await User.findById(id)
  return user.toJSON()
}

module.exports = { getAllUsers, getUserById }
