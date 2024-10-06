import { getSession } from '@/sessions'

export async function isUser(request) {
  const session = await getSession(request.headers.get('Cookie'))

  if (session.has('userId')) return true

  return false
}
