import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import Users from './components/Users'
import { useNotificationDispatch } from './contexts/NotificationContext'

const UserView = ({ users }) => {
  const id = useParams().id
  const user = users?.find(u => u.id === id)
  if (!user) return null
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>{user.blogs.map(b => <li key={b.id}>{b.title}</li>)}</ul>
    </div>
  )
}

const BlogView = ({ blogs, handleLike, handleComment }) => {
  const id = useParams().id
  const blog = blogs?.find(b => b.id === id)
  const [comment, setComment] = useState('')
  if (!blog) return null

  const addComment = (e) => {
    e.preventDefault()
    handleComment(blog.id, comment)
    setComment('')
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>{blog.likes} likes <button onClick={() => handleLike(blog)}>like</button></div>
      <div>added by {blog.user.name}</div>
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <input value={comment} onChange={(e) => setComment(e.target.value)} />
        <button type="submit">add comment</button>
      </form>
      <ul>{blog.comments?.map((c, i) => <li key={i}>{c}</li>)}</ul>
    </div>
  )
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const blogResult = useQuery({ queryKey: ['blogs'], queryFn: blogService.getAll })
  const userResult = useQuery({ queryKey: ['users'], queryFn: userService.getAll })

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, newObject }) => blogService.update(id, newObject),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] })
  })

  const commentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] })
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (payload) => {
    dispatch({ type: 'SET', payload })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch { notify('wrong credentials') }
  }

  const handleLike = (blog) => {
    updateBlogMutation.mutate({ id: blog.id, newObject: { ...blog, likes: blog.likes + 1, user: blog.user.id } })
  }

  const handleComment = (id, comment) => {
    commentMutation.mutate({ id, comment })
  }

  if (blogResult.isLoading || userResult.isLoading) return <div>loading...</div>

  if (!user) return (
    <div>
      <h2>login</h2>
      <Notification />
      <form onSubmit={handleLogin}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">login</button>
      </form>
    </div>
  )

  return (
    <Router>
      <div style={{ background: '#eee', padding: 5 }}>
        <Link to="/">blogs</Link> <Link to="/users">users</Link> {user.name} logged in 
        <button onClick={() => { window.localStorage.clear(); window.location.reload() }}>logout</button>
      </div>
      <Notification />
      <Routes>
        <Route path="/users/:id" element={<UserView users={userResult.data} />} />
        <Route path="/users" element={<Users />} />
        <Route path="/blogs/:id" element={<BlogView blogs={blogResult.data} handleLike={handleLike} handleComment={handleComment} />} />
        <Route path="/" element={
          <div>
            <h2>blog app</h2>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <BlogForm createBlog={(obj) => queryClient.setQueryData(['blogs'], blogResult.data.concat(obj))} />
            </Togglable>
            {blogResult.data.map(blog => <div key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></div>)}
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App