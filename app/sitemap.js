import { listSitemapProducts } from '@/lib/products'
import { SITE_URL } from '@/lib/seo'

export const runtime = 'nodejs'
export const revalidate = 3600

const staticRoutes = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/catalog', changeFrequency: 'daily', priority: 0.9 },
  { path: '/prices', changeFrequency: 'daily', priority: 0.8 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contacts', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/certificates', changeFrequency: 'monthly', priority: 0.5 },
]

export default async function sitemap() {
  const now = new Date()

  let products = []

  try {
    products = await listSitemapProducts()
  } catch (error) {
    console.error('Failed to build product sitemap:', error)
  }

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...products.map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: product.updated_at || product.created_at || now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
  ]
}

