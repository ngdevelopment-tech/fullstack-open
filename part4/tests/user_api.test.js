const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
})

test('creation fails with proper statuscode and message if password is too short', async () => {
  const newUser = {
    username: 'naim',
    name: 'Naim',
    password: '12'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  expect(result.body.error).toContain('password must be at least 3 characters long')
})

afterAll(async () => {
  await mongoose.connection.close()
})