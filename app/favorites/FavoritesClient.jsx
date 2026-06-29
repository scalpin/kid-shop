'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import FavoriteButton from '@/app/components/FavoriteButton'
import { useFavoriteSlugs } from '@/app/components/useFavorites'

export default function FavoritesClient() {
  const slugs = useFavoriteSlugs()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slugs.length === 0) {
      setProducts([])
      setIsLoading(false)
      setError('')
      return
    }

    const controller = new AbortController()

    async function loadProducts() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch('/api/favorite-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slugs }),
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Не удалось загрузить избранные товары')
        }

        const data = await response.json()
        setProducts(Array.isArray(data.items) ? data.items : [])
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message)
          setProducts([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => controller.abort()
  }, [slugs])

  if (slugs.length === 0) {
    return (
      <div className="favorites-empty">
        <h1>Избранное</h1>
        <p>В избранном пока ничего нет. Добавляйте товары сердечком в каталоге или на странице товара.</p>
        <Link href="/catalog" className="favorites-empty__link">Перейти в каталог</Link>
      </div>
    )
  }

  return (
    <>
      <div className="favorites-page__head">
        <h1 className="catalog-title">Избранное</h1>
        <p className="favorites-page__note">
          Сохранено в этом браузере: {slugs.length}
        </p>
      </div>

      {error && <div className="catalog-empty">{error}</div>}
      {isLoading && <div className="catalog-empty">Загружаем избранные товары…</div>}

      {!isLoading && !error && (
        <div className="catalog-grid">
          {products.map((product) => (
            <div key={product.slug} className="product-card">
              <Link href={`/products/${product.slug}`} className="product-card__link">
                <img src={product.images?.[0] || '/logo_blue(cuted).png'} alt={product.name} className="product-card__img" />
                <div className="product-card__name">{product.name}</div>
                {product.price != null && <div className="product-card__price">{Number(product.price)} ₽</div>}
              </Link>
              <FavoriteButton slug={product.slug} name={product.name} variant="catalog" />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
