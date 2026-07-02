import { requireAdmin } from '@/lib/admin-auth'
import ProductForm from '../ProductForm'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function NewProductPage({ searchParams }) {
  await requireAdmin()
  const resolvedSearchParams = await searchParams
  const error = typeof resolvedSearchParams?.error === 'string' ? resolvedSearchParams.error : ''

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Новый товар</p>
          <h1>Добавить товар</h1>
        </div>
      </header>

      {error && (
        <div className="admin-alert admin-alert--error">
          {error}
        </div>
      )}

      <ProductForm action="/admin/api/products" submitLabel="Создать товар" />
    </main>
  )
}
