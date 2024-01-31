const router = require('express').Router()
const log = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')

router.get('/', async (req, res) => {
  const fetchedBlogs = await Blog.find({}).populate('user')
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
  const randomUser = await User.findOne({})

  const blog = {
    ...req.body,
    user: randomUser._id
  }

  const blogObject = new Blog(blog)

  const savedBlog = await blogObject.save()
  res.status(201).json(savedBlog)
})

router.delete('/:id', async (req, res) => {
  const result = await Blog.findByIdAndRemove(req.params.id)
  if (result) {
    res.status(204).end()
  }
  res.status(404).end()
})

router.put('/:id', async (req, res) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(updatedBlog)
})

module.exports = router
