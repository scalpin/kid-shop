export function getAdminRedirectUrl(request, path) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = forwardedHost || request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') || 'https'

  if (host) {
    return new URL(path, `${proto}://${host}`)
  }

  return new URL(path, request.url)
}
