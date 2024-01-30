const router = require('express').Router()
const log = require('../utils/logger')
const Blog = require('../models/blog')

router.get('/', async (req, res) => {
  const fetchedBlogs = await Blog.find({})
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
  const blogToSave = new Blog(req.body)

  const savedBlog = await blogToSave.save()
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
