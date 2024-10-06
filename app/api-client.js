import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

const mongodbUri = process.env.MONGODB_URI ?? ''

if (!mongodbUri) throw new Error('Mongodb URI not found.')

let client

if (process.env.ENV === 'production') {
  client = new MongoClient(mongodbUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })
} else {
  if (!global.db) global.db = new MongoClient(mongodbUri)

  client = global.db
}

export { client, ObjectId }
