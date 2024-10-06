import { createCookieSessionStorage } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { isSignIn } from './utils/isSignIn'
import { isSignUp } from './utils/isSignUp'

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: 'userId',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      secrets: [
        'a7a1b0525ddb12255a2d59e55f53b47aa90076d77174f30a32a3cf8a8adcf796',
      ],
    },
  })

export async function getUserSession(request) {
  const session = await getSession(request.headers.get('Cookie'))

  if (!session.has('userId')) {
    if (!isSignUp(request) && !isSignIn(request)) throw redirect('/sign-in')
  }

  if (session.has('userId')) {
    if (isSignUp(request) || isSignIn(request)) throw redirect('/user')
  }

  return session
}
