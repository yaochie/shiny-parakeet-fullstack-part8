import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [filter, setFilter] = useState('')
  const [books, setBooks] = useState([])
  const result = useQuery(ALL_BOOKS)

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result.data])

  if (!props.show) {
    return null
  }

  const genreFilter = () => {
    if (filter.length > 0) {
      return (
        <div>books in genre <strong>{filter}</strong></div>
      )
    } else {
      return (
        <div>books in all genres</div>
      )
    }
  }

  const filterButtons = () => {
    const allGenres = []
    books.forEach(b => allGenres.push( ...b.genres ))
    const genres = Array.from(new Set(allGenres))
    if (genres.length === 0) {
      return null
    }

    const singleGenres = () => genres.map(g => (
      <button key={g} onClick={() => setFilter(g)}>{g}</button>
    ))

    return (
      <div>
        {singleGenres()}
        <button key='all' onClick={() => setFilter('')}>all genres</button>
      </div>
    )
  }

  const bookList = () => {
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

  return (
    <div>
      <h2>books</h2>

      {genreFilter()}

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

      <div>
        {filterButtons()}
      </div>
    </div>
  )
}

export default Books
