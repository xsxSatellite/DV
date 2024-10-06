import { NavLink, Outlet } from '@remix-run/react'
import clsx from 'clsx'
import { ChartPie, User, ChevronRight } from 'lucide-react'

import { toWordCase } from '@/utils/toWordCase'

export default function Layout() {
  return (
    <div className='drawer relative lg:drawer-open'>
      <input id='sidebar' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content min-h-screen px-8 py-4'>
        <label
          htmlFor='sidebar'
          aria-label='open sidebar'
          className='btn drawer-button absolute bottom-5 left-5'
        >
          <ChevronRight />
        </label>
        <Outlet />
      </div>
      <div className='drawer-side'>
        <label
          htmlFor='sidebar'
          aria-label='close sidebar'
          className='drawer-overlay'
        />
        <ul className='menu min-h-screen w-80 bg-base-200 p-4 text-base-content'>
          <li>
            <NavLink
              to='/user'
              className={({ isPending }) =>
                clsx(
                  'flex items-center justify-between',
                  isPending && 'opacity-50',
                )
              }
            >
              <span>{toWordCase('user')}</span>
              <User />
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/dashboard'
              className={({ isPending }) =>
                clsx(
                  'flex items-center justify-between',
                  isPending && 'opacity-50',
                )
              }
            >
              <span>{toWordCase('dashboard')}</span>
              <ChartPie />
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}
