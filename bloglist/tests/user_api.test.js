const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const log = require('../utils/logger')
const app = require('../app')
const helper = require('../utils/test_helper')

const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')

describe('when there is 1 user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('porkkana', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('create valid user successfully with status 200 and is actually present in db', async () => {
    const testUser = {
      username: 'tester',
      name: 'Karjalan Koitturi',
      password: 'varmasalasana'
    }

    const res = await api.post('/api/users/').send(testUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(res.body.username).toBe('tester')

    const user = await helper.getUserById(res.body.id)
    expect(user.username).toBeDefined()
  })

  test('if USERNAME MISSING, abort creation with error 400', async () => {
    const testUser = {
      name: 'Karjalan Koitturi',
      password: 'varmasalasana'
    }

    const res = await api.post('/api/users').send(testUser)
      .expect(400)

    const checkUsers = await helper.getUsersByFilter({ name: testUser.name })
    expect(checkUsers).toHaveLength(0)
  })

  test('if USERNAME TAKEN, abort creation with error 400', async () => {
    const testUser = {
      username: 'root',
      name: 'Karjalan Koitturi',
      password: 'varmasalasana'
    }

    const res = await api.post('/api/users').send(testUser)
      .expect(400)

    const checkUsers = await helper.getUsersByFilter({ name: testUser.name })
    expect(checkUsers).toHaveLength(0)
  })

  test('if USERNAME TOO SHORT, abort creation with error 400', async () => {
    const testUser = {
      username: 'XD',
      name: 'Karjalan Koitturi',
      password: 'varmasalasana'
    }

    const res = await api.post('/api/users').send(testUser)
      .expect(400)

    const checkUsers = await helper.getUsersByFilter({ name: testUser.name })
    expect(checkUsers).toHaveLength(0)
  })

  test('if PASSWORD MISSING, abort creation with error 400', async () => {
    const testUser = {
      username: 'tester',
      name: 'Karjalan Koitturi',
    }

    const res = await api.post('/api/users').send(testUser)
      .expect(400)

    const checkUsers = await helper.getUsersByFilter({ name: testUser.name })
    expect(checkUsers).toHaveLength(0)
  })

  test('if PASSWORD TOO SHORT, abort creation with error 400', async () => {
    const testUser = {
      username: 'tester',
      name: 'Karjalan Koitturi',
      password: 'XD',
    }

    const res = await api.post('/api/users').send(testUser)
      .expect(400)

    const checkUsers = await helper.getUsersByFilter({ name: testUser.name })
    expect(checkUsers).toHaveLength(0)
  })

  test('get all -> BLOGS NESTED', async () => {
    await Blog.deleteMany({})
    await helper.createTestBlog()

    const res = await api.get('/api/users')
    const test = await api.get('/api/blogs')

    log.info(res.body[0])
    log.info(test.body[0])

    expect(res.body[0].blogs[0].title).toBeDefined()
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
