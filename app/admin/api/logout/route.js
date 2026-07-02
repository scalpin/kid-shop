import { NextResponse } from 'next/server'
import { clearAdminSessionCookie } from '@/lib/admin-auth'
import { getAdminRedirectUrl } from '@/lib/admin-redirect'

export const runtime = 'nodejs'

export async function POST(request) {
  const response = NextResponse.redirect(getAdminRedirectUrl(request, '/admin/login'), {
    status: 303,
  })

  clearAdminSessionCookie(response)

  return response
}
