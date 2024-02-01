const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = require('express').Router()
const User = require('../models/user')


router.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!passwordCorrect) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 3600 })

  res.json({ token, username: user.username, name: user.name })
})

module.exports = router
