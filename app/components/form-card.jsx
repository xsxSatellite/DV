import { useFetcher } from '@remix-run/react'

import { toSentenceCase } from '@/utils/toSentenceCase'
import { toWordCase } from '@/utils/toWordCase'

// if after the form submission, redirection is required, should use form component from Remix, for example file upload in user route, but leaving it like this for now
export function FormCard({
  subject,
  description,
  encType = 'application/x-www-form-urlencoded',
  children,
}) {
  const fetcher = useFetcher()
  const isBusy = fetcher.state === 'submitting' || fetcher.state === 'loading'

  return (
    <div className='rounded-md border-2 px-6 py-4 shadow-sm'>
      <h2 className='text-xl font-bold'>{toWordCase(subject)}</h2>
      <p>{toSentenceCase(description)}</p>
      <div className='divider'></div>
      <fetcher.Form
        method='POST'
        encType={encType}
        className='flex flex-col gap-y-8'
      >
        {children({ toWordCase, isBusy })}
      </fetcher.Form>
    </div>
  )
}
