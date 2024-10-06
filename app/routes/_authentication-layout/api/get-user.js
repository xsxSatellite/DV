import { client, ObjectId } from '@/api-client'

export async function getUser({ id, email, projection }) {
  const collection = client.db('data_visualization').collection('users')
  const query = {}

  if (id) query._id = new ObjectId(id)

  if (email) query.email = email

  return await collection.findOne(query, { projection: { ...projection } })
}
