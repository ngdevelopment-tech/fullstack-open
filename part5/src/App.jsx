import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [msgType, setMsgType] = useState('success')
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user)) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername(''); setPassword('')
    } catch (e) {
      setMsgType('error'); setMessage('Wrong credentials')
      setTimeout(() => setMessage(null), 5000)
    }
  }

const createBlog = async (blogObject) => {
  try {
   
    const returnedBlog = await blogService.create(blogObject)
    
    
    setBlogs(blogs.concat(returnedBlog))
    
    
    if (blogFormRef.current) {
      blogFormRef.current.toggleVisibility()
    }
    
    
    setMsgType('success')
    setMessage(`added ${returnedBlog.title} by ${returnedBlog.author}`)
    setTimeout(() => setMessage(null), 5000)
    
  } catch (exception) {
    setMsgType('error')
    setMessage('Failed to create blog')
    setTimeout(() => setMessage(null), 5000)
  }
}

  const handleLike = async (blog) => {
    const updated = { ...blog, likes: blog.likes + 1 }
    await blogService.update(blog.id, updated)
    setBlogs(blogs.map(b => b.id === blog.id ? updated : b))
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  if (user === null) {
    return (
      <form onSubmit={handleLogin}>
        <h2>Log in to application</h2>
        {message && <div className={msgType}>{message}</div>}
        <div>username <input value={username} onChange={({target}) => setUsername(target.value)} /></div>
        <div>password <input type="password" value={password} onChange={({target}) => setPassword(target.value)} /></div>
        <button type="submit">login</button>
      </form>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {message && <div className={msgType}>{message}</div>}
      <p>{user.name} logged in <button onClick={() => { window.localStorage.clear(); window.location.reload() }}>logout</button></p>
      
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      {blogs.sort((a, b) => b.likes - a.likes).map(blog => 
        <div key={blog.id} style={{ border: '1px solid black', margin: 5, padding: 5 }}>
          {blog.title} {blog.author} 
          <button onClick={() => handleLike(blog)}>like {blog.likes}</button>
          <button onClick={() => handleDelete(blog)}>remove</button>
        </div>
      )}
    </div>
  )
}

export default App