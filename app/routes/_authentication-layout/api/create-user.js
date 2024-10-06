import { client } from '@/api-client'

export async function createUser({ email, password }) {
  const database = client.db('data_visualization')
  const collection = database.collection('users')

  const result = await collection.insertOne({
    email,
    password,
    createdAt: new Date(),
  })

  return result
}
