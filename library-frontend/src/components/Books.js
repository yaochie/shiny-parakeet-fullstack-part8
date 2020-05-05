import React, { useState, useEffect } from 'react'
import { useLazyQuery, useQuery, useApolloClient, useSubscription } from '@apollo/client'

import { ALL_BOOKS, ALL_GENRES, BOOK_ADDED } from '../queries'

const Books = (props) => {
  const [filter, setFilter] = useState('')
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const genreResult = useQuery(ALL_GENRES)
  const [getSomeBooks, bookResult] = useLazyQuery(ALL_BOOKS)
  const client = useApolloClient()

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

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(b => b.id).includes(object.id)

    const data = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(data.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: {
          ...data,
          allBooks: [ ...data.allBooks, addedBook ]
        }
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      const title = addedBook.title
      const author = addedBook.author.name
      console.log(`added new book ${title} by ${author}!`)
      updateCacheWith(addedBook)
    }
  })

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
