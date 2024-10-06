import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { updateUser } from './api/update-user'

import { createBill } from '../_application-layout.dashboard/api/create-bill'
import { getUser } from '../_authentication-layout/api/get-user'

import { Button } from '@/components/button'
import { FieldControl } from '@/components/field-control'
import { FormCard } from '@/components/form-card'
import { getUserSession } from '@/sessions'
import { toSentenceCase } from '@/utils/toSentenceCase'
import { toWordCase } from '@/utils/toWordCase'

export async function loader({ request }) {
  const session = await getUserSession(request)

  // potential timeout error
  const user = await getUser({
    id: session.get('userId'),
    projection: { email: 1 },
  })

  return json({ status: 'success', data: { ...user } }, { status: 200 })
}

export async function action({ request }) {
  const session = await getUserSession(request)
  const formData = await request.formData()

  // potentially formAction is undefined (malicious user's action)
  switch (formData.get('formAction')) {
    case 'update': {
      // not knowing how to work around request body can't be read twice yet, so that manually getting data from form data instead
      const email = formData.get('email')
      const password = formData.get('password')
      const data = {}

      if (email) data.email = email
      if (password) data.password = password

      if (email) {
        const user = await getUser({ email, projection: { email: 1 } })

        if (user) {
          return json(
            {
              status: 'failure',
              error: { email: ['Email is in use, try another one.'] },
            },
            { status: 409 },
          )
        }
      }

      // potential timeout error
      const user = await updateUser({ id: session.get('userId'), update: data })

      return json({ status: 'success', data: { ...user } })
    }
    case 'upload': {
      // handle form encType
      const billFile = formData.get('CSV')

      // least protection of integrity of databse, if it's not expected text/csv, then don't do anything
      if (billFile.type !== 'text/csv') return null

      const content = await billFile.text()
      const dateRow = content.split('\r\n', 3).at(2)

      // the index start and index end below is respectively the start character and end character from date row containing start date and end date
      const startDate = dateRow.substring(6, 25)
      const endDate = dateRow.substring(33, 52)
      const arrayBuffer = await billFile.arrayBuffer()
      const buffer = new Uint8Array(arrayBuffer)

      // potential timeout error
      await createBill({
        id: session.get('userId'),
        bill: buffer,
        start: startDate,
        end: endDate,
      })

      // potential confusion, if insertion of bill file isn't successful
      return redirect('/dashboard')
    }
  }

  return null
}

export default function User() {
  const loaderData = useLoaderData()

  return (
    <>
      <h1 className='text-4xl font-bold'>{toWordCase('account')}</h1>
      <p>{toSentenceCase('manage your account information.')}</p>
      <div className='divider'></div>
      <div className='grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:gap-x-8'>
        <FormCard
          subject='personal information'
          description='update your current email or password.'
        >
          {({ toWordCase, isBusy }) => (
            <>
              <div className='flex flex-col gap-y-4'>
                <FieldControl
                  type='email'
                  name='email'
                  data={
                    loaderData?.status === 'success'
                      ? loaderData.data?.email
                      : undefined
                  }
                />
                <FieldControl type='password' name='password' />
              </div>
              <Button
                type='submit'
                isBusy={isBusy}
                name='formAction'
                value='update'
              >
                {toWordCase('update')}
              </Button>
            </>
          )}
        </FormCard>
        <FormCard
          subject='provide your file'
          description='upload your CSV file to visualize.'
          encType='multipart/form-data'
        >
          {({ toWordCase, isBusy }) => (
            <>
              <input
                required
                type='file'
                name='CSV'
                className='file-input'
                accept='text/csv'
              />
              <Button
                type='submit'
                isBusy={isBusy}
                name='formAction'
                value='upload'
              >
                {toWordCase('upload')}
              </Button>
            </>
          )}
        </FormCard>
      </div>
    </>
  )
}
