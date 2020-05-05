import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS, MY_INFO } from '../queries'

const Recommend = ({ show, userToken }) => {
  const [books, setBooks] = useState([])
  const [user, setUser] = useState(null)
  const result = useQuery(ALL_BOOKS)
  const userInfo = useQuery(MY_INFO)

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result.data])

  useEffect(() => {
    if (userInfo.data) {
      setUser(userInfo.data.me)
    }
  }, [userInfo.data, userToken])

  if (!show) {
    return null
  }

  const bookList = () => {
    if (user === null) {
      return books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
      )
    }

    const filter = user.favoriteGenre
    let booksToShow

    if (filter.length === 0) {
      booksToShow = books
    } else {
      booksToShow = books.filter(b => b.genres.includes(filter))
    }

    return booksToShow.map(a =>
          <tr key={a.title}>
            <td>{a.title}</td>
            <td>{a.author.name}</td>
            <td>{a.published}</td>
          </tr>
    )
  }

  const recommendDescription = () => {
    if (user === null) {
      return null
    }

    return (
      <div>
        books in your favourite genre <strong>{user.favoriteGenre}</strong>
      </div>
    )
  }

  return (
    <div>
      <h2>recommendations</h2>

      {recommendDescription()}

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {bookList()}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
