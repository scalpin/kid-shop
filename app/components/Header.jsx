// components/Header.jsx
import Link from 'next/link'
import Image from 'next/image'

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
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="header-logo" aria-label="На главную">
          <Image
            src="/logo_blue.png"
            alt="Счастливчик"
            width={290}
            height={64}
            priority
            className="logo-img"
          />
        </Link>

        {/* правая часть: поиск + избранное + контакты */}
        <div className="header-right">
          {/* поиск */}
          <form className="search" role="search" action="/search" method="GET">
            <input
              className="search__input"
              type="text"
              name="q"
              placeholder="Найти товары"
              aria-label="Поиск по каталогу"
            />
            <button className="search__btn" type="submit" aria-label="Искать">
              {/* простая лупа */}
              <svg className="search__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.57-4.23C15.99 6.01 13.48 3.5 10.5 3.5S5.01 6.01 5.01 9 7.52 14.5 10.5 14.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l4.5 4.49L20 18.5 15.5 14zm-5 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z"/>
              </svg>
            </button>
          </form>

          {/* избранное */}
          <a href="/favorites" className="fav" aria-label="Избранное">
            <HeartIcon className="fav__icon" />
            <span className="fav__badge">0</span>
          </a>

          {/* контакты */}
          {/*
          <div className="header-contacts">
            <a href="tel:+7973674519" className="contact-row">
              <PhoneIcon className="contact-icon" />
              <span className="contact-phone">
                <span className="font-semibold">+7 (927) 367-45-19</span>{' '}
              </span>
            </a>

            <a href="mailto:abroskin.06.77@mail.ru" className="contact-row">
              <MailIcon className="contact-icon" />
              <span className="contact-email">abroskin.06.77@mail.ru</span>
            </a>
          </div>
          */}
        </div>
      </div>
    </header>
  )
}