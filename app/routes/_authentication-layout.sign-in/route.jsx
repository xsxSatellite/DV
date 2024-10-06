import { json, redirect } from '@remix-run/node'
import { useActionData, useNavigation } from '@remix-run/react'
import * as v from 'valibot'

import { getUser } from '../_authentication-layout/api/get-user'
import { AuthenticationFormSchema } from '../_authentication-layout/schema'
import { comparePassword } from '../_authentication-layout/utils'

import { AuthenticationForm } from '@/components/authentication-form'
import { Button } from '@/components/button'
import { commitSession, getUserSession } from '@/sessions'
import { getFormData } from '@/utils/getFormData'

export async function loader({ request }) {
  await getUserSession(request)

  return null
}

export async function action({ request }) {
  const session = await getUserSession(request)
  const formData = await getFormData(request)
  const result = v.safeParse(AuthenticationFormSchema, formData)

  if (!result.success) {
    const { nested } = v.flatten(result.issues)

    return json(
      {
        state: 'failure',
        error: { email: nested?.email, password: nested?.password },
      },
      { status: 400 },
    )
  }
  const { email, password } = result.output

  const user = await getUser({ email })

  if (!user) {
    return json(
      {
        status: 'failure',
        error: { email: ['Incorrect email or password.'] },
      },
      { status: 400 },
    )
  }

  if (!comparePassword({ password, passwordWithHash: user.password })) {
    return json({
      status: 'failure',
      error: { email: ['Incorrect email or password.'] },
    })
  }

  session.set('userId', String(user._id))

  return redirect('/user', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export default function SignIn() {
  const actionData = useActionData()
  const navigation = useNavigation()
  const isBusy =
    navigation.state === 'loading' || navigation.state === 'submitting'

  // render prop (children prop as funtion) is for avoiding one layer of prop drilling, increasing reusability (subject), and not using context
  return (
    <AuthenticationForm
      subject='sign in'
      error={actionData?.status === 'failure' ? actionData.error : undefined}
      replace={true}
    >
      {({ subject }) => (
        <Button type='submit' isBusy={isBusy}>
          {subject}
        </Button>
      )}
    </AuthenticationForm>
  )
}
