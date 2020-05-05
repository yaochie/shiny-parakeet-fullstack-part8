import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import { CHANGE_BIRTH, ALL_AUTHORS, AUTHOR_NAMES } from '../queries'

const ChangeBirth = () => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  const [authors, setAuthors] = useState([])

  const result = useQuery(AUTHOR_NAMES)

  const [ changeBirth ] = useMutation(CHANGE_BIRTH, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  useEffect(() => {
    if (result.data) {
      const data = result.data.allAuthors.map(a => a.name)
      setAuthors(data)
      if (data.length > 0) {
        setName(data[0])
      }
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()

    console.log(name, year)

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
