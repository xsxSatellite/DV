export function isSignIn(request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  if (pathname === '/sign-in') return true

  return false
}
