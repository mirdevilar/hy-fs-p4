const jwt = require('jsonwebtoken')

const router = require('express').Router()
const log = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')

router.get('/', async (req, res) => {
  const fetchedBlogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(fetchedBlogs)
})

router.get('/:id', async (req, res) => {
  const fetchedBlog = await Blog.findById(req.params.id)
  if (fetchedBlog) {
    res.json(fetchedBlog)
  }
  res.status(404).end()
})

router.post('/', async (req, res) => {
  const { user } = req

  const blog = new Blog({
    ...req.body,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

router.delete('/:id', async (req, res) => {
  const { user } = req

  const blog = await Blog.findById(req.params.id)

  if (user.id.toString() === blog.user.toString()) {
    await Blog.deleteOne({ _id: blog.id })
    res.status(204).end()
  } else {
    return res.status(401).json({ error: 'valid but unauthorized token' })
  }

  res.status(404).end()
})

router.put('/:id', async (req, res) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(updatedBlog)
})

module.exports = router
