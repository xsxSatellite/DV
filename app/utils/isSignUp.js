export function isSignUp(request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  if (pathname === '/sign-up') return true

  return false
}
