import { NextResponse } from 'next/server'
import { listSearchSuggestions } from '@/lib/products'

export const runtime = 'nodejs'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''

  try {
    const products = await listSearchSuggestions(query, 6)

    return NextResponse.json({
      items: products.map((product) => ({
        name: product.name,
        slug: product.slug,
        image: product.images?.[0] || '/logo_blue(cuted).png',
      })),
    })
  } catch (error) {
    return NextResponse.json(
      { items: [], error: error.message },
      { status: 500 },
    )
  }
}
