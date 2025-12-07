import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Бренд */}
        <div className="footer-col footer-brand">
          <Link href="/" className="footer-logo" aria-label="На главную">
            <Image
              src="/logo_blue.png"
              alt="Счастливчик"
              width={160}
              height={36}
              className="footer-logo__img"
            />
          </Link>
          <div className="footer-copy">© {year} Счастливчик</div>
        </div>

        {/* Информация */}
        <div className="footer-col">
          <div className="footer-title">Информация</div>
          <ul className="footer-links">
            <li><Link href="/about">О компании</Link></li>
            <li><Link href="/certificates">Сертификаты</Link></li>
            <li><Link href="/contacts">Как заказать</Link></li>
            <li><Link href="/prices">Прайс-лист</Link></li>
          </ul>
        </div>

        {/* Контакты */}
        <div className="footer-col footer-contacts">
          <div className="footer-title">Контакты</div>
          <a href="tel:+79273674519" className="footer-phone">+7&nbsp;(927)&nbsp;367-45-19</a>
          <a href="tel:+79273674519" className="footer-phone">+7&nbsp;(927)&nbsp;287-69-26</a>
          <a href="mailto:abroskin.06.77@mail.ru" className="footer-email">abroskin.06.77@mail.ru</a>
        </div>

        {/* Выгрузка товаров */}
        <div className="footer-col">
            <div className="footer-title">Выгрузить товары</div>
            <ul className="footer-links">
                <li><Link href="/">price-list.xml</Link></li>
                <li><Link href="/">price-list.xls</Link></li>
                <li><Link href="/">price-list.csv</Link></li>
            </ul>
        </div>

      </div>
    </footer>
  )
}