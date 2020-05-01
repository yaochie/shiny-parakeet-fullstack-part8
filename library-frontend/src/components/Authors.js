import React from 'react'
import { useQuery } from '@apollo/client'

import { ALL_AUTHORS } from '../queries'
import ChangeBirth from './ChangeBirth'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }

  let authors = []
  if (!result.loading) {
    authors = result.data.allAuthors
  }

  return (
    <div>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>
                born
              </th>
              <th>
                books
              </th>
            </tr>
            {authors.map(a =>
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ChangeBirth />
    </div>
  )
}

export default Authors
