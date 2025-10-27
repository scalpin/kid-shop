// app/catalog/page.js
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const revalidate = 60

export const metadata = { title: 'Каталог' }

export default async function CatalogPage() {
  const { data: products, error } = await supabase
    .from('products')
    .select('name, slug, price, images')
    .order('created_at', { ascending: false })

  if (error) {
    return <pre className="p-6 text-red-600">{error.message}</pre>
  }

  return (
    <main className="catalog-page">
      <h1 className="catalog-title">Каталог</h1>
      <div className="catalog-grid">
        {(products ?? []).map(p => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="product-card" id="product-card">
            <img src={p.images?.[0] || '/placeholder.png'} alt={p.name} className="product-card__img" />
            <div className="product-card__name">{p.name}</div>
            {p.price != null && <div className="product-card__price">{Number(p.price)} ₽</div>}
          </Link>
        ))}
      </div>
    </main>
  )
}
