const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const log = require('../utils/logger')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

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
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('porkkana', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()

  await Blog.deleteMany({})
  const randomUser = await User.findOne({})

  const blogObjects = multipleBlogs.map((b) => new Blog({ ...b, user: randomUser.id }))

  const promiseArray = blogObjects.map((b) => b.save())
  await Promise.all(promiseArray)
}, 100000)

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

test('user ref populated', async () => {
  const res = await api.get('/api/blogs')
  expect(res.body[0].user.username).toBeDefined()
}, 100000)

describe('creation of new blog', () => {
  test('successful creation and present in database', async () => {
    const loginRes = await api.post('/api/login/')
      .send({ username: 'root', password: 'porkkana' })

    const { token } = loginRes.body

    const testBlog = {
      title: 'test',
      author: 'tester',
      url: 'http://example.com',
      likes: 5
    }

    const resPost = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(resPost.body.title).toBe(testBlog.title)

    const resGet = await api.get('/api/blogs')
    expect(resGet.body).toHaveLength(multipleBlogs.length + 1)
    const created = resGet.body.map((b) => b.id).includes(resPost.body.id)
    expect(created).toBe(true)
  })

  test('user ref is present', async () => {
    const testBlog = {
      title: 'test user ref',
      author: 'tester',
      url: 'http://example.com',
    }

    const res = await api.post('/api/blogs').send(testBlog)

    expect(res.body.user).toBeDefined()
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

describe('deletion of blog', () => {
  let token
  let blog

  beforeEach(async () => {
    const loginRes = await api.post('/api/login/')
      .send({ username: 'root', password: 'porkkana' })

    token = loginRes.body.token

    const testBlog = {
      title: 'test',
      author: 'tester',
      url: 'http://example.com',
      likes: 5
    }

    const resPost = await api.post('/api/blogs').send(testBlog)
      .set('Authorization', `Bearer ${token}`)
    blog = resPost.body
  })

  test('if id is valid, success with status 204 and blog is indeed not in db anymore', async () => {
    await api.delete(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const resGet = await api.get(`/api/blogs/${blog.id}`)
      .expect(404)
  }, 100000)

  test('if inexistent, error 404', async () => {
    await api.delete('/65b93d62a835776194824980')
      .expect(404)
  })

  test('if token invalid, do not delete', async () => {
    await api.delete(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${'wrongtoken'}`)

    await api.get(`/api/blogs/${blog.id}`)
      .expect(200)
  })

  test('if wrong token, error 401 and do not delete', async () => {
    const username = 'wronguser'
    const password = 'correctpass'
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({ username, passwordHash })

    await user.save()

    const loginRes = await api.post('/api/login/')
      .send({ username, password })

    const wrongToken = loginRes.body.token

    await api.delete(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${wrongToken}`)
      .expect(401)

    const resGet = await api.get(`/api/blogs/${blog.id}`)
      .expect(200)
  })
})

describe('update blog', () => {
  test('if id is valid, success with status 200 and likes have been updated in db', async () => {
    const testBlog = {
      title: 'test',
      author: 'tester',
      url: 'http://example.com',
      likes: 0
    }

    const resPost = await api.post('/api/blogs').send(testBlog)

    await api.put(`/api/blogs/${resPost.body.id}`).send({ ...resPost.body, likes: resPost.body.likes + 1 })
      .expect(200)

    const resGet = await api.get(`/api/blogs/${resPost.body.id}`)
    expect(resGet.body.likes).toBe(resPost.body.likes + 1)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
