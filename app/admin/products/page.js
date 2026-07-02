import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import { listAdminProducts } from '@/lib/admin-products'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function formatPrice(price) {
  if (price === '' || price === null || price === undefined) {
    return '—'
  }

  return `${new Intl.NumberFormat('ru-RU').format(Number(price))} ₽`
}

export default async function AdminProductsPage({ searchParams }) {
  await requireAdmin()

  const resolvedSearchParams = await searchParams
  const search = typeof resolvedSearchParams?.q === 'string' ? resolvedSearchParams.q.trim() : ''
  const saved = resolvedSearchParams?.saved === '1'
  const products = await listAdminProducts({ search })

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Админ-панель</p>
          <h1>Каталог</h1>
          <p className="admin-muted">
            Товары, фотографии, цены и видимость на сайте.
          </p>
        </div>

        <div className="admin-header__actions">
          <form method="post" action="/admin/api/logout">
            <button type="submit" className="admin-button">Выйти</button>
          </form>
          <Link href="/admin/products/new" className="admin-button admin-button--primary">
            Добавить товар
          </Link>
        </div>
      </header>

      {saved && (
        <div className="admin-alert admin-alert--success">
          Изменения сохранены.
        </div>
      )}

      <form className="admin-toolbar" method="get">
        <input name="q" defaultValue={search} placeholder="Поиск по названию, артикулу, материалу" />
        <button type="submit" className="admin-button">Найти</button>
        {search && <Link href="/admin/products" className="admin-link">Сбросить</Link>}
      </form>

      <section className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Товар</th>
              <th>Артикул</th>
              <th>Цена</th>
              <th>Статус</th>
              <th aria-label="Действия" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="admin-product-cell">
                    <img
                      src={product.images?.[0] || '/logo_blue(cuted).png'}
                      alt=""
                      className="admin-product-cell__image"
                    />
                    <div>
                      <Link href={`/admin/products/${product.id}`} className="admin-product-cell__name">
                        {product.name}
                      </Link>
                      <div className="admin-product-cell__slug">{product.slug}</div>
                    </div>
                  </div>
                </td>
                <td>{product.sku || '—'}</td>
                <td>{formatPrice(product.price)}</td>
                <td>
                  <span className={`admin-status${product.is_active ? ' admin-status--active' : ''}`}>
                    {product.is_active ? 'На сайте' : 'Скрыт'}
                  </span>
                </td>
                <td>
                  <div className="admin-row-actions">
                    <Link href={`/admin/products/${product.id}`} className="admin-link">Редактировать</Link>
                    <form method="post" action={`/admin/api/products/${product.id}/toggle`}>
                      <input type="hidden" name="is_active" value={product.is_active ? 'false' : 'true'} />
                      <button type="submit" className="admin-link admin-link--button">
                        {product.is_active ? 'Скрыть' : 'Показать'}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="admin-empty">
            Товары не найдены.
          </div>
        )}
      </section>
    </main>
  )
}
