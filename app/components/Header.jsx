'use client'

// components/Header.jsx
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFavoriteSlugs } from './useFavorites'

function HeartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M12 21s-6.716-4.286-9.428-7.714C.857 11.143 1.2 7.2 4.2 5.486 6.3 4.286 8.829 4.8 10.286 6.514L12 8.571l1.714-2.057C15.171 4.8 17.7 4.286 19.8 5.486c3 1.714 3.343 5.657 1.629 7.8C18.716 16.714 12 21 12 21z"/>
    </svg>
  )
}

function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V21a1 1 0 01-1 1C11.3 22 2 12.7 2 2a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.2 2.2z"/>
    </svg>
  )
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5L4 8V6l8 5 8-5v2z"/>
    </svg>
  )
}

export default function Header() {
  const router = useRouter()
  const searchRef = useRef(null)
  const favoriteSlugs = useFavoriteSlugs()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  useEffect(() => {
    const currentUrl = new URL(window.location.href)

    if (currentUrl.pathname === '/catalog') {
      setQuery(currentUrl.searchParams.get('q') || '')
    }
  }, [])

  useEffect(() => {
    const searchQuery = query.trim()

    if (!searchQuery) {
      setSuggestions([])
      setIsLoadingSuggestions(false)
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setIsLoadingSuggestions(true)

      try {
        const response = await fetch(`/api/search-products?q=${encodeURIComponent(searchQuery)}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Search request failed')
        }

        const data = await response.json()
        setSuggestions(Array.isArray(data.items) ? data.items : [])
        setIsSuggestionsOpen(true)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSuggestions([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSuggestions(false)
        }
      }
    }, 180)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [query])

  useEffect(() => {
    function handleDocumentMouseDown(event) {
      if (!searchRef.current?.contains(event.target)) {
        setIsSuggestionsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentMouseDown)

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown)
    }
  }, [])

  function handleSearchSubmit(event) {
    event.preventDefault()

    const searchQuery = query.trim()
    const href = searchQuery ? `/catalog?q=${encodeURIComponent(searchQuery)}` : '/catalog'

    setIsSuggestionsOpen(false)
    router.push(href)
  }

  function handleSearchKeyDown(event) {
    if (event.key === 'Escape') {
      setIsSuggestionsOpen(false)
    }
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="header-logo" aria-label="На главную">
          <div className="logo-wrap">
            <Image
              src="/logo_kroha(cuted).png"
              alt="Кроха трикотажевна"
              width={290}
              height={64}
              priority
              className="logo-img"
            />
            <div className="logo-subtitle">Производство детского трикотажа</div>
          </div>
        </Link>

        {/* правая часть: поиск + избранное + контакты */}
        <div className="header-right">
          {/* поиск */}
          <form
            className="search"
            role="search"
            onSubmit={handleSearchSubmit}
            ref={searchRef}
          >
            <input
              className="search__input"
              type="text"
              name="q"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setIsSuggestionsOpen(Boolean(event.target.value.trim()))
              }}
              onFocus={() => {
                if (query.trim()) {
                  setIsSuggestionsOpen(true)
                }
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Найти товары"
              aria-label="Поиск по каталогу"
              aria-expanded={isSuggestionsOpen}
              aria-controls="search-suggestions"
              autoComplete="off"
            />
            <button className="search__btn" type="submit" aria-label="Искать">
              <svg className="search__icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="M15.5 15.5 21 21" />
              </svg>
            </button>

            {isSuggestionsOpen && (
              <div className="search__suggestions" id="search-suggestions">
                {suggestions.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/products/${product.slug}`}
                    className="search__suggestion"
                    onClick={() => setIsSuggestionsOpen(false)}
                  >
                    <img
                      src={product.image}
                      alt=""
                      className="search__suggestion-img"
                    />
                    <span className="search__suggestion-name">{product.name}</span>
                  </Link>
                ))}

                {!isLoadingSuggestions && suggestions.length === 0 && query.trim() && (
                  <div className="search__suggestion-empty">Ничего не найдено</div>
                )}
              </div>
            )}
          </form>

          {/* избранное */}
          <Link href="/favorites" className="fav" aria-label="Избранное">
            <HeartIcon className="fav__icon" />
            <span className="fav__badge">{favoriteSlugs.length}</span>
          </Link>

          {/* контакты */}
          
          <div className="header-contacts">
            <a href="tel:+79273674519" className="contact-row">
              <PhoneIcon className="contact-icon" />
              <span className="contact-phone">
                <span className="font-semibold">+7 (927) 287-69-26</span>{' '}
              </span>
            </a>
          </div>
          
        </div>
      </div>
    </header>
  )
}
