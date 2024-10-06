import { client, ObjectId } from '@/api-client'

export async function updateUser({ id, update }) {
  const collection = client.db('data_visualization').collection('users')

  return await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...update,
      },
      $currentDate: {
        lastModified: true,
      },
    },
  )
}
