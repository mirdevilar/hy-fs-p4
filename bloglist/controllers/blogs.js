const router = require('express').Router()
const log = require('../utils/logger')
const Blog = require('../models/blog')

router.get('/', async (req, res) => {
  const fetchedBlogs = await Blog.find({})
  res.json(fetchedBlogs)
})

router.post('/', async (req, res, next) => {
  const blogToSave = new Blog(req.body)

  try {
    const savedBlog = await blogToSave.save()
    res.status(201).json(savedBlog)
  } catch (err) {
    next(err)
  }
})

module.exports = router
