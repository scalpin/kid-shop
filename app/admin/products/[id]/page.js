import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { getAdminProductById } from '@/lib/admin-products'
import ProductForm from '../ProductForm'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function EditProductPage({ params, searchParams }) {
  await requireAdmin()

  const { id } = await params
  const resolvedSearchParams = await searchParams
  const product = await getAdminProductById(id)
  const error = typeof resolvedSearchParams?.error === 'string' ? resolvedSearchParams.error : ''

  if (!product) {
    notFound()
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Редактирование</p>
          <h1>{product.name}</h1>
          {resolvedSearchParams?.saved === '1' && (
            <p className="admin-success-inline">Изменения сохранены.</p>
          )}
        </div>
      </header>

      {error && (
        <div className="admin-alert admin-alert--error">
          {error}
        </div>
      )}

      <ProductForm
        product={product}
        action={`/admin/api/products/${product.id}`}
        submitLabel="Сохранить"
      />
    </main>
  )
}
