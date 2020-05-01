import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import { CHANGE_BIRTH, ALL_AUTHORS, AUTHOR_NAMES } from '../queries'

const ChangeBirth = () => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const result = useQuery(AUTHOR_NAMES)

  const [ changeBirth ] = useMutation(CHANGE_BIRTH, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  let authors = []
  if (!result.loading) {
    authors = result.data.allAuthors.map(a => a.name)
  }

  const submit = async (event) => {
    event.preventDefault()

    changeBirth({
      variables: {
        name,
        setBornTo: Number(year)
      }
    })

    setName('')
    setYear('')
  }

  return (
    <div>
      <h2>Set birth year</h2>
      <form onSubmit={submit}>
        <div>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          born
          <input
            type='number'
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default ChangeBirth
