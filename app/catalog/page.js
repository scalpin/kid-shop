// app/catalog/page.js
import Link from 'next/link'
import { listCatalogProducts } from '@/lib/products'

export const runtime = 'nodejs'
export const revalidate = 60

export const metadata = { title: 'Каталог' }

export default async function CatalogPage() {
  let products = []

  try {
    products = await listCatalogProducts()
  } catch (error) {
    return <pre className="p-6 text-red-600">{error.message}</pre>
  }

  return (
    <main className="catalog-page">
      <h1 className="catalog-title">Каталог</h1>
      <div className="catalog-grid">
        {products.map(p => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="product-card" id="product-card">
            <img src={p.images?.[0] || '/logo_blue(cuted).png'} alt={p.name} className="product-card__img" />
            <div className="product-card__name">{p.name}</div>
            {p.price != null && <div className="product-card__price">{Number(p.price)} ₽</div>}
          </Link>
        ))}
      </div>
    </main>
  )
}
