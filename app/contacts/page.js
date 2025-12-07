// app/contacts/page.js
export const metadata = { title: 'Контакты' }

export default function ContactsPage() {
  return (
    <main className="contacts">
      <div className="contacts__inner">
        <h1 className="contacts__h1">Контакты</h1>

        <section className="contacts__grid">
          {/* левая колонка: основные контакты */}
          <div className="contacts__card">
            <h2 className="contacts__title">Заказ и вопросы</h2>

            <div className="contacts__row">
              <div className="contacts__label">Телефон</div>
              <a href="tel:+79273674519" className="contacts__phone">+7&nbsp;(927)&nbsp;367-45-19</a>
            </div>

            <div className="contacts__row">
              <div className="contacts__label">Почта</div>
              <a href="mailto:abroskin.06.77@mail.ru" className="contacts__email">abroskin.06.77@mail.ru</a>
            </div>

            <p className="contacts__note">Заказ оформляется по телефону</p>

            <div className="contacts__actions">
              <a href="tel:+79273674519" className="btn btn--primary">Позвонить</a>
              <a href="/" className="btn btn--ghost">Как заказать</a>
            </div>

            <p className="contacts__note">ИП АБРОСЬКИН</p>
            <p className="contacts__note">ИНН 111111111111111</p>
            <p className="contacts__note">ОГРН 111111111111111</p>

          </div>

          {/* правая колонка: адрес/доставка */}
          <div className="contacts__card">
            <h2 className="contacts__title">Доставка и производство</h2>
            <ul className="contacts__list">
              <li>Производство в Пензе</li>
              <li>Отправка по РФ и СНГ транспортными компаниями</li>
              <li>Заказ от 3000 ₽</li>
            </ul>

            <div className="contacts__map">
                <iframe
                    className="contacts__map-iframe"
                    title="Карта Яндекс"
                    src="https://yandex.ru/map-widget/v1/?ll=45.022493%2C53.135469&z=16&l=map&pt=45.022493,53.135469,pm2rdm"
                    allowFullScreen
                />
                <div className="contacts__map-meta">
                    <a
                    href="https://yandex.ru/maps/?pt=45.022493,53.135469&z=16&l=map"
                    target="_blank" rel="noopener noreferrer"
                    >Открыть на Яндекс.Картах</a>
                </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  )
}
