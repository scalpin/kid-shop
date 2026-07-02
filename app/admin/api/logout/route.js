import { NextResponse } from 'next/server'
import { clearAdminSessionCookie } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function POST(request) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url), {
    status: 303,
  })

  clearAdminSessionCookie(response)

  return response
}
