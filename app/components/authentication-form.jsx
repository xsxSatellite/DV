import { Link, Form } from '@remix-run/react'

import { FieldControl } from './field-control'

import { toWordCase } from '@/utils/toWordCase'

export function AuthenticationForm({ subject, error, replace, children }) {
  return (
    <div className='flex flex-col gap-y-8'>
      <h1 className='text-center text-2xl'>{toWordCase(subject)}</h1>
      <Form className='flex flex-col gap-y-6' method='POST' replace={replace}>
        <FieldControl type='email' name='email' error={error?.email} />
        <FieldControl type='password' name='password' error={error?.password} />
        {children({ subject })}
      </Form>
      <p>
        {subject === 'sign up'
          ? 'Already have an account? '
          : 'Not have an account yet? '}
        <Link
          to={subject === 'sign up' ? '/sign-in' : '/sign-up'}
          className='link link-info'
        >
          {subject === 'sign up'
            ? toWordCase('sign in')
            : toWordCase('sign up')}
        </Link>{' '}
        then
      </p>
    </div>
  )
}
