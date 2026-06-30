'use client'

// components/MainMenu.jsx
import Link from 'next/link'
import { useState } from 'react'

export default function MainMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav id="main-menu" className={`main-menu${isOpen ? ' main-menu--open' : ''}`}>
      <button
        type="button"
        className="main-menu__toggle"
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className="main-menu__inner">
        <ul className="main-menu__list">
          {[
            { href: '/',            label: 'Главная' },
            { href: '/catalog',     label: 'Каталог' },
            { href: '/about',       label: 'О компании' },
            { href: '/certificates',label: 'Документы' },
            { href: '/contacts',    label: 'Контакты' },
          ].map(item => (
            <li key={item.label} className="main-menu__item">
              <Link href={item.href} className="main-menu__link" onClick={() => setIsOpen(false)}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
