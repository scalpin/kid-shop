'use client'

import { toggleFavoriteSlug, useIsFavorite } from './useFavorites'

export default function FavoriteButton({ slug, name, variant = 'catalog' }) {
  const isFavorite = useIsFavorite(slug)

  function handleClick(event) {
    event.preventDefault()
    event.stopPropagation()
    toggleFavoriteSlug(slug)
  }

  return (
    <button
      type="button"
      className={`favorite-button favorite-button--${variant}${isFavorite ? ' favorite-button--active' : ''}`}
      onClick={handleClick}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Убрать из избранного: ${name}` : `Добавить в избранное: ${name}`}
      title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
    >
      <svg className="favorite-button__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.3s-6.7-4.2-9.1-7.7C1.1 10 1.7 6.5 4.4 5.1c2-1 4.3-.5 5.6 1.1L12 8.6l2-2.4c1.3-1.6 3.7-2.1 5.6-1.1 2.7 1.4 3.3 4.9 1.5 7.5-2.4 3.5-9.1 7.7-9.1 7.7Z" />
      </svg>
    </button>
  )
}
