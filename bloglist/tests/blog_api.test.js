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

  const blogObjects = multipleBlogs.map((b) => new Blog(b))
  const promiseArray = blogObjects.map((b) => b.save())
  await Promise.all(promiseArray)
})

test('returns correct amount of blogs as json', async () => {
  const res = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(res.body).toHaveLength(2)
})

test('has id and not _id', async () => {
  const res = await api.get('/api/blogs')
  expect(res.body[0].id).toBeDefined()
})

describe('creation of new blog', () => {
  test('successful creation and present in database', async () => {
    const testBlog = {
      title: 'test',
      author: 'tester',
      url: 'http://example.com',
      votes: 5
    }

    const resPost = await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(resPost.body.title).toBe(testBlog.title)

    const resGet = await api.get('/api/blogs')
    expect(resGet.body).toHaveLength(multipleBlogs.length + 1)
    const created = resGet.body.map((b) => b.id).includes(resPost.body.id)
    expect(created).toBe(true)
  })

  test('if likes property missing, default to 0', async () => {
    const testBlog = {
      title: 'test likes missing',
      author: 'tester',
      url: 'http://example.com',
    }

    const res = await api
      .post('/api/blogs')
      .send(testBlog)
    expect(res.body.likes).toBe(0)
  })

  test('if title is missing, error 400', async () => {
    const testBlog = {
      author: 'tester',
      url: 'http://example.com',
      likes: 5,
    }

    const res = await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(400)
  })

  test('if url is missing, error 400', async () => {
    const testBlog = {
      title: 'test no url',
      author: 'tester',
      likes: 5,
    }

    const res = await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
