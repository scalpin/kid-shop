import { NextResponse } from 'next/server'
import { listProductsBySlugs } from '@/lib/products'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const body = await request.json()
    const slugs = Array.isArray(body?.slugs) ? body.slugs : []
    const products = await listProductsBySlugs(slugs)

    return NextResponse.json({ items: products })
  } catch (error) {
    return NextResponse.json(
      { items: [], error: error.message },
      { status: 500 },
    )
  }
}
