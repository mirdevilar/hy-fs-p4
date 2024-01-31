const bcrypt = require('bcrypt')

const router = require('express').Router()
const User = require('../models/user')
const log = require('../utils/logger')

router.post('/', async (req, res) => {
  const { username, name, password } = req.body
  log.info(req.body)
  const passwordHash = '5523'//await bcrypt.hash(req.body.password, 10)

  const userToCreate = { username, name, passwordHash }

  //log.info(userToCreate)

  const user = await new User(userToCreate)

  const savedUser = await user.save()

  res.status(200).json(savedUser)
})

router.get('/', async (req, res) => {
  const allUsers = await User.find({})

  res.json(allUsers)
})

module.exports = router
