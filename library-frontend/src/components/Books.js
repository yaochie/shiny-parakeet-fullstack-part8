import React, { useState, useEffect } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'

import { ALL_BOOKS, ALL_GENRES } from '../queries'

const Books = (props) => {
  const [filter, setFilter] = useState('')
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const genreResult = useQuery(ALL_GENRES)
  const [getSomeBooks, bookResult] = useLazyQuery(ALL_BOOKS)

  useEffect(() => {
    if (genreResult.data) {
      setGenres(genreResult.data.allBooks)
    }
  }, [genreResult.data])

  useEffect(() => {
    if (filter.length > 0) {
      getSomeBooks({ variables: { genre: filter } })
    } else {
      getSomeBooks()
    }
  }, [filter]) // eslint-disable-line

  useEffect(() => {
    if (bookResult.data) {
      setBooks(bookResult.data.allBooks)
    }
  }, [bookResult.data])

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
    genres.forEach(b => allGenres.push( ...b.genres ))
    const genreSet = Array.from(new Set(allGenres))
    if (genreSet.length === 0) {
      return null
    }

    const singleGenres = () => genreSet.map(g => (
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
    return books.map(a =>
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
