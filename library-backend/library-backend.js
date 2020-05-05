const {
  ApolloServer, UserInputError, gql, AuthenticationError, PubSub
} = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

mongoose.set('useFindAndModify', false)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)

const MONGODB_URI = 'mongodb+srv://fullstack:Ug3241eDETzm1RLH@phonebook-cluster-9acgb.mongodb.net/library-graphql?retryWrites=true'

const JWT_SECRET = 'SECRET_KEY'

console.log('connecting to', MONGODB_URI)
const pubsub = new PubSub()

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {}

      if (args.author) {
        const authorId = await Author.findOne({ name: args.author })
        filter.author = authorId._id
      }

      if (args.genre) {
        filter.genres = args.genre
      }

      return Book.find(filter)
    },
    allAuthors: () => {
      return Author.find({})
    },
    me: (root, args, { currentUser }) => {
      return currentUser
    }
  },
  Book: {
    author: (root) => {
      return Author.findOne({ _id: root.author })
    }
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        // add author
        author = new Author({ name: args.author, bookCount: 1 })
        console.log('new author', author)
        try {
          await author.save()
        } catch(error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }
      } else {
        author.bookCount += 1
        await author.save()
      }

      const book = new Book({ ...args, author: author })
      console.log('new book', book)

      try {
        await book.save()
      } catch(error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        console.log('couldn\'t find author')
        return null
      }

      author.born = args.setBornTo

      try {
        await author.save()
      } catch(error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return author
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      try {
        await user.save()
      } catch(error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'password' ) {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      try {
        const decodedToken = jwt.verify(
          auth.substring(7), JWT_SECRET
        )
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      } catch(error) {
        console.error('invalid user-token set')
      }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
