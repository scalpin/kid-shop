'use client'

import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'kroha-trikotazhevna:favorites:v1'
const FAVORITES_EVENT = 'kroha-trikotazhevna:favorites-changed'

function normalizeSlugs(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return [...new Set(value.filter((slug) => typeof slug === 'string' && slug.trim()))]
}

export function readFavoriteSlugs() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return normalizeSlugs(raw ? JSON.parse(raw) : [])
  } catch {
    return []
  }
}

function writeFavoriteSlugs(slugs) {
  if (typeof window === 'undefined') {
    return
  }

  const nextSlugs = normalizeSlugs(slugs)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSlugs))
  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: nextSlugs }))
}

export function toggleFavoriteSlug(slug) {
  const currentSlugs = readFavoriteSlugs()
  const isFavorite = currentSlugs.includes(slug)
  const nextSlugs = isFavorite
    ? currentSlugs.filter((item) => item !== slug)
    : [slug, ...currentSlugs]

  writeFavoriteSlugs(nextSlugs)
  return !isFavorite
}

export function useFavoriteSlugs() {
  const [slugs, setSlugs] = useState([])

  useEffect(() => {
    setSlugs(readFavoriteSlugs())

    function handleFavoritesChange(event) {
      setSlugs(normalizeSlugs(event.detail || readFavoriteSlugs()))
    }

    function handleStorage(event) {
      if (event.key === STORAGE_KEY) {
        setSlugs(readFavoriteSlugs())
      }
    }

    window.addEventListener(FAVORITES_EVENT, handleFavoritesChange)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(FAVORITES_EVENT, handleFavoritesChange)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  return slugs
}

export function useIsFavorite(slug) {
  const slugs = useFavoriteSlugs()

  return useMemo(() => slugs.includes(slug), [slugs, slug])
}
