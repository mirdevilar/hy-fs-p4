const bcrypt = require('bcrypt')

const router = require('express').Router()
const User = require('../models/user')
const log = require('../utils/logger')

router.post('/', async (req, res, next) => {
  const { username, name, password } = req.body

  if (!password) {
    next(new Error('password required'))
  }
  if (password.length < 3) {
    next(new Error('password must be at least 3 characters long'))
  }

  const passwordHash = await bcrypt.hash(req.body.password, 10)

  const userToCreate = { username, name, passwordHash }
  const user = await new User(userToCreate)

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

router.get('/', async (req, res) => {
  const allUsers = await User.find({})

  res.json(allUsers)
})

module.exports = router
