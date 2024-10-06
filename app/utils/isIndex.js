export function isIndex(request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  if (pathname.endsWith('/')) return true

  return false
}
