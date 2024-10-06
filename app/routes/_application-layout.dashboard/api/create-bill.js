import { client, ObjectId } from '@/api-client'

export async function createBill({ id, bill, start, end }) {
  const collection = await client.db('data_visualization').collection('bills')

  return await collection.insertOne({
    user: new ObjectId(id),
    bill,
    start,
    end,
  })
}
