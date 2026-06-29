// app/catalog/page.js
import Link from 'next/link'
import FavoriteButton from '@/app/components/FavoriteButton'
import { listCatalogProducts } from '@/lib/products'

export const runtime = 'nodejs'
export const revalidate = 60

export const metadata = { title: 'Каталог' }

function getCatalogSearch(searchParams) {
  const value = searchParams?.q

  if (Array.isArray(value)) {
    return value[0]?.trim() || ''
  }

  return typeof value === 'string' ? value.trim() : ''
}

export default async function CatalogPage({ searchParams }) {
  let products = []
  const resolvedSearchParams = await searchParams
  const search = getCatalogSearch(resolvedSearchParams)

  try {
    products = await listCatalogProducts({ search })
  } catch (error) {
    return <pre className="p-6 text-red-600">{error.message}</pre>
  }

  return (
    <main className="catalog-page">
      <h1 className="catalog-title">Каталог</h1>
      {search && (
        <p className="catalog-search-note">
          Результаты поиска по запросу «{search}»: {products.length}
        </p>
      )}

      {products.length > 0 ? (
        <div className="catalog-grid">
          {products.map(p => (
            <div key={p.slug} className="product-card">
              <Link href={`/products/${p.slug}`} className="product-card__link">
                <img src={p.images?.[0] || '/logo_blue(cuted).png'} alt={p.name} className="product-card__img" />
                <div className="product-card__name">{p.name}</div>
                {p.price != null && <div className="product-card__price">{Number(p.price)} ₽</div>}
              </Link>
              <FavoriteButton slug={p.slug} name={p.name} variant="catalog" />
            </div>
          ))}
        </div>
      ) : (
        <div className="catalog-empty">
          По этому запросу ничего не найдено. Попробуйте изменить формулировку
          или посмотреть весь каталог.
        </div>
      )}
    </main>
  )
}
