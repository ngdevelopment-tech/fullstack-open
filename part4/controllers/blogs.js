const blogsRouter = require('express').Router()

let blogs = [
  { id: "1", title: "Test Blog", author: "Naim", url: "localhost", likes: 10, user: { name: "Naim" } }
]

blogsRouter.get('/', (req, res) => res.json(blogs))

blogsRouter.post('/', (req, res) => {
  const body = req.body
  const newBlog = {
    title: body.title || 'New Blog',
    author: body.author || 'Naim',
    url: body.url || 'http://localhost',
    likes: 0,
    id: Math.random().toString(36).substring(2),
    user: { name: "Naim" }
  }
  blogs = blogs.concat(newBlog)
  res.status(201).json(newBlog)
})

blogsRouter.put('/:id', (req, res) => {
  const body = req.body
  blogs = blogs.map(b => b.id === req.params.id ? { ...b, likes: body.likes } : b)
  res.json(body)
})


blogsRouter.delete('/:id', (req, res) => {
  const id = req.params.id
  blogs = blogs.filter(b => b.id !== id)
  res.status(204).end()
})

module.exports = blogsRouter