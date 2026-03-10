const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  const userForToken = { username: user.username, id: user._id }
  token = jwt.sign(userForToken, process.env.SECRET)

  const initialBlogs = [
    { title: 'React patterns', author: 'Michael Chan', url: 'https://react.com', likes: 7, user: user._id },
    { title: 'Go To Statement', author: 'Edsger W. Dijkstra', url: 'http://u.arizona.edu', likes: 5, user: user._id }
  ]

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  await Promise.all(blogObjects.map(blog => blog.save()))
})

test('blogs are returned as json', async () => {
  await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
})

test('a valid blog can be added', async () => {
  const newBlog = { title: 'Token Test', author: 'Naim', url: 'http://test.com', likes: 10 }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(3)
})

test('adding a blog fails with 401 if token is not provided', async () => {
  const newBlog = { title: 'No Token', author: 'Naim', url: 'http://test.com' }
  await api.post('/api/blogs').send(newBlog).expect(401)
})

test('a blog can be deleted by its creator', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')
  expect(blogsAtEnd.body).toHaveLength(1)
})

afterAll(async () => {
  await mongoose.connection.close()
})