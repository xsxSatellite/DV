import { client, ObjectId } from '@/api-client'

export async function getBill(id) {
  const collection = client.db('data_visualization').collection('bills')

  return await collection.findOne(
    { user: new ObjectId(id) },
    { sort: { start: -1 }, projection: { start: 1, end: 1, bill: 1 } },
  )
}
