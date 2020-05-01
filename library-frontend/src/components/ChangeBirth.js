import React, { useState } from 'react'
import { useMutation } from '@apollo/client'

import { CHANGE_BIRTH, ALL_AUTHORS } from '../queries'

const ChangeBirth = () => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const [ changeBirth ] = useMutation(CHANGE_BIRTH, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

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
          <input
            type='text'
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
          born
          <input
            type='number'
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        <div>
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default ChangeBirth
