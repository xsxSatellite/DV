import { Outlet } from "@remix-run/react"

export default function Layout() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Outlet />
    </div>
  )
}
