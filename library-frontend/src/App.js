import React, { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const navLinks = () => {
    const loggedIn = localStorage.getItem('user-token') !== null

    return (
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {loggedIn
          ? <button onClick={() => setPage('add')}>add book</button>
          : null}
        {loggedIn
          ? <button onClick={logout}>logout</button>
          : null}
        {loggedIn
          ? null
          : <button onClick={() => setPage('login')}>login</button>}
      </div>
    )
  }

  return (
    <div>
      {navLinks()}

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setError={console.error}
        setPage={setPage}
      />

    </div>
  )
}

export default App
