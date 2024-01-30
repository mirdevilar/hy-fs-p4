const mongoose = require('mongoose')
const supertest = require('supertest')
const log = require('../utils/logger')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

const multipleBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  multipleBlogs.forEach(async (b) => {
    const blog = new Blog(b)
    await blog.save()
  })
})

test('returns correct amount of blogs as json', async () => {
  const res = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(res.body).toHaveLength(2)
})

test('has id and not _id', async () => {
  const res = await api.get('/api/blogs')
  log.info(res.body[0])
  expect(res.body[0].id).toBeDefined()
  expect(res.body[0]._id).toBeUndefined()
})

afterAll(async () => {
  await mongoose.connection.close()
})
