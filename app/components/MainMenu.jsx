// components/MainMenu.jsx
import Link from 'next/link'

export default function MainMenu() {
  return (
    <nav id="main-menu" className="main-menu">
      <div className="main-menu__inner">
        <ul className="main-menu__list">
          {[
            { href: '/',            label: 'Главная' },
            { href: '/catalog',     label: 'Каталог' },
            { href: '/about',       label: 'О компании' },
            { href: '/certificates',label: 'Сертификаты' },
            { href: '/contacts',    label: 'Контакты' },
          ].map(item => (
            <li key={item.label} className="main-menu__item">
              <Link href={item.href} className="main-menu__link">{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}