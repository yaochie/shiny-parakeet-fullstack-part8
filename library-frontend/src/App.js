import React, { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const savedToken = localStorage.getItem('user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const navLinks = () => {
    const loggedIn = token !== null

    return (
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {loggedIn
          ? <button onClick={() => setPage('add')}>add book</button>
          : null}
        {loggedIn
          ? <button onClick={() => setPage('recommend')}>recommend</button>
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

      <Recommend
        show={page === 'recommend'}
        userToken={token}
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
