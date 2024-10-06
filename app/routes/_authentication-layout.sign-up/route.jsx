import { json, redirect } from '@remix-run/node'
import { useActionData, useNavigation } from '@remix-run/react'
import * as v from 'valibot'

import { createUser } from '../_authentication-layout/api/create-user'
import { getUser } from '../_authentication-layout/api/get-user'
import { AuthenticationFormSchema } from '../_authentication-layout/schema'
import { hashPassword } from '../_authentication-layout/utils'

import { AuthenticationForm } from '@/components/authentication-form'
import { Button } from '@/components/button'
import { getUserSession } from '@/sessions'
import { getFormData } from '@/utils/getFormData'

export async function loader({ request }) {
  await getUserSession(request)

  return null
}

export async function action({ request }) {
  const formData = await getFormData(request)

  const result = v.safeParse(AuthenticationFormSchema, formData, {
    abortPipeEarly: true,
  })

  if (!result.success) {
    const { nested } = v.flatten(result.issues)

    return json(
      {
        status: 'failure',
        error: { email: nested?.email, password: nested?.password },
      },
      { status: 400 },
    )
  }

  const { email, password } = result.output

  if (await getUser({ email })) {
    return json(
      {
        status: 'failure',
        error: { email: ['Email is in use, try another one.'] },
      },
      {
        status: 409,
      },
    )
  }

  const passwordWithHash = hashPassword(password)

  // potential timeout error
  await createUser({
    email,
    password: passwordWithHash,
  })

  return redirect('/sign-in')
}

export default function SignUp() {
  const actionData = useActionData()
  const navigation = useNavigation()
  const isBusy =
    navigation.state === 'loading' || navigation.state === 'submitting'

  // render prop (children prop as funtion) is for avoiding one layer of prop drilling, increasing reusability (subject), and not using context
  return (
    <AuthenticationForm
      subject='sign up'
      error={actionData?.status === 'failure' ? actionData.error : undefined}
    >
      {({ subject }) => (
        <Button type='submit' isBusy={isBusy}>
          {subject}
        </Button>
      )}
    </AuthenticationForm>
  )
}
