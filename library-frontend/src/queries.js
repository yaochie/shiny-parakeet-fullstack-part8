import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  title
  published
  genres
  author {
    name
  }
}
`

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
  }
}
`

export const AUTHOR_NAMES = gql`
query {
  allAuthors {
    name
  }
}
`

export const ALL_BOOKS = gql`
query allBooks($author: String, $genre: String) {
  allBooks(
    author: $author,
    genre: $genre
  ) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const ALL_GENRES = gql`
query {
  allBooks {
    genres
  }
}
`

export const ADD_BOOK = gql`
mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
  addBook(
    title: $title,
    published: $published,
    author: $author,
    genres: $genres
  ) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const CHANGE_BIRTH = gql`
mutation changeBirth($name: String!, $setBornTo: Int!) {
  editAuthor(
    name: $name,
    setBornTo: $setBornTo
  ) {
    name
    born
  }
}
`

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(
    username: $username,
    password: $password
  ) {
    value
  }
}
`

export const MY_INFO = gql`
query {
  me {
    username
    favoriteGenre
  }
}
`

export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

