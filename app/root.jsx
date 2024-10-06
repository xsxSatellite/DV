import { redirect } from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

import { isIndex } from './utils/isIndex'

import './tailwind.css'

export async function loader({ request }) {
  if (isIndex(request)) return redirect('/user')

  return null
}

export function meta({ error }) {
  return [
    { title: error ? 'Opps!' : 'Data Visualization' },
    {
      property: 'og:title',
      content: 'Visualizing CSV data with chart',
    },
    {
      name: 'description',
      content: 'Data visualization will visualize CSV data with chart',
    },
  ]
}

export function ErrorBoundary() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <div className='flex min-h-screen items-center justify-center'>
          <p className='text-2xl'>
            Something went wrong, please try and refresh later.
          </p>
        </div>
        <Scripts />
      </body>
    </html>
  )
}

export function Layout({ children }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
