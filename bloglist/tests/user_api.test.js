const mongoose = require('mongoose')
const supertest = require('supertest')

const log = require('../utils/logger')
const app = require('../app')
const helper = require('../utils/test_helper')

const api = supertest(app)
const User = require('../models/user')

const testUser = {
  username: 'tester',
  name: 'Karjalan Koitturi',
  password: 'varmasalasana'
}

beforeEach(async () => {
  await User.deleteMany({})
})

test('create user successfully with status 200 and is actually present in db', async () => {
  const res = await api.post('/api/users/').send(testUser)
    .expect(200)
  expect(res.body.username).toBe('tester')

  const user = await helper.getUserById(res.body.id)
  expect(user.username).toBeDefined()
})

afterAll(async () => {
  await mongoose.connection.close()
})
