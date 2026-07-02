import { NextResponse } from 'next/server'
import { createAdminSessionCookie, verifyAdminPassword } from '@/lib/admin-auth'
import { getAdminRedirectUrl } from '@/lib/admin-redirect'

export const runtime = 'nodejs'

export async function POST(request) {
  const formData = await request.formData()
  const password = String(formData.get('password') || '')

  if (!process.env['ADMIN_PASSWORD_HASH'] && process.env.NODE_ENV === 'production') {
    return NextResponse.redirect(getAdminRedirectUrl(request, '/admin/login?error=not-configured'), {
      status: 303,
    })
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.redirect(getAdminRedirectUrl(request, '/admin/login?error=1'), {
      status: 303,
    })
  }

  const response = NextResponse.redirect(getAdminRedirectUrl(request, '/admin/products'), {
    status: 303,
  })
  const cookie = createAdminSessionCookie()

  response.cookies.set(cookie.name, cookie.value, cookie.options)

  return response
}
