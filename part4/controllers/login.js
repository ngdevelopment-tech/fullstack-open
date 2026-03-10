const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
  const { username } = request.body
  if (username === 'naim') {
    const user = { username: 'naim', name: 'Naim', id: '12345' }
    const token = jwt.sign(user, process.env.SECRET || 'secret')
    return response.status(200).send({ token, username: user.username, name: user.name })
  }
  return response.status(401).json({ error: 'invalid username' })
})

module.exports = loginRouter