import { useState } from 'react'
import { useQuery, useMutation, useApolloClient } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK, EDIT_AUTHOR } from './queries' // Add LOGIN query here

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)

  if (authorsResult.loading || booksResult.loading) return <div>loading...</div>

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      {page === 'authors' && <Authors authors={authorsResult.data.allAuthors} showEdit={!!token} />}
      {page === 'books' && <Books books={booksResult.data.allBooks} />}
      {page === 'add' && <NewBook setPage={setPage} />}
      {page === 'login' && <LoginForm setToken={setToken} setPage={setPage} />}
    </div>
  )
}


export default App