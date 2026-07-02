import Link from 'next/link'

function formatList(value) {
  return Array.isArray(value) ? value.join('\n') : ''
}

function formatSizes(value) {
  return Array.isArray(value) ? value.join(', ') : ''
}

export default function ProductForm({ product, action, submitLabel }) {
  const isNew = !product

  return (
    <form className="admin-editor" method="post" action={action} encType="multipart/form-data">
      <div className="admin-editor__main">
        <section className="admin-card">
          <h2>Основное</h2>

          <label className="admin-field">
            <span>Название *</span>
            <input name="name" defaultValue={product?.name || ''} required />
          </label>

          <label className="admin-field">
            <span>Адрес страницы / slug</span>
            <input
              name="slug"
              defaultValue={product?.slug || ''}
              placeholder="Можно оставить пустым — создастся из названия"
            />
          </label>

          <div className="admin-grid admin-grid--2">
            <label className="admin-field">
              <span>Артикул</span>
              <input name="sku" defaultValue={product?.sku || ''} />
            </label>

            <label className="admin-field">
              <span>Цена, ₽</span>
              <input
                name="price"
                inputMode="decimal"
                defaultValue={product?.price === '' ? '' : product?.price}
                placeholder="Например: 320"
              />
            </label>
          </div>

          <label className="admin-field">
            <span>Материал</span>
            <input name="material" defaultValue={product?.material || ''} />
          </label>

          <label className="admin-field">
            <span>Размеры</span>
            <input
              name="sizes"
              defaultValue={formatSizes(product?.sizes)}
              placeholder="56, 62, 68, 74"
            />
          </label>

          <label className="admin-field">
            <span>Описание</span>
            <textarea name="description" rows={6} defaultValue={product?.description || ''} />
          </label>

          <label className="admin-checkbox">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={isNew ? true : Boolean(product?.is_active)}
            />
            <span>Показывать товар в каталоге</span>
          </label>
        </section>

        <section className="admin-card">
          <h2>Фотографии</h2>
          <p className="admin-muted">
            Первая строка в списке считается главной фотографией товара.
          </p>

          {Array.isArray(product?.images) && product.images.length > 0 && (
            <div className="admin-images">
              {product.images.map((src) => (
                <img key={src} src={src} alt="" />
              ))}
            </div>
          )}

          <label className="admin-field">
            <span>Текущие изображения</span>
            <textarea
              name="images"
              rows={5}
              defaultValue={formatList(product?.images)}
              placeholder="/uploads/products/example/photo.webp"
            />
          </label>

          <label className="admin-field">
            <span>Загрузить новые изображения</span>
            <input type="file" name="images_upload" accept="image/*" multiple />
          </label>
        </section>

        <section className="admin-card">
          <h2>Документы</h2>
          <label className="admin-field">
            <span>Ссылки на документы, по одной в строке</span>
            <textarea
              name="certificates"
              rows={4}
              defaultValue={formatList(product?.certificates)}
            />
          </label>
        </section>
      </div>

      <aside className="admin-editor__side">
        <div className="admin-card admin-sticky">
          <button type="submit" className="admin-button admin-button--primary">
            {submitLabel}
          </button>

          <Link href="/admin/products" className="admin-button">
            Вернуться к списку
          </Link>

          {product?.slug && (
            <Link href={`/products/${product.slug}`} className="admin-link" target="_blank">
              Открыть карточку на сайте
            </Link>
          )}
        </div>
      </aside>
    </form>
  )
}
