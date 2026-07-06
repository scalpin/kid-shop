// app/contacts/page.js
export const metadata = {
  title: 'Контакты',
  description:
    'Контакты производителя детской одежды Кроха Трикотажевна: телефон, почта, реквизиты и адрес производства в Пензе.',
  alternates: {
    canonical: '/contacts',
  },
}

export default function ContactsPage() {
  return (
    <main className="contacts">
      <div className="contacts__inner">
        <section className="contacts__hero">
          <p className="contacts__eyebrow">Связь с производителем</p>
          <h1 className="contacts__h1">Контакты</h1>
          <p className="contacts__lead">
            «Кроха Трикотажевна» – оптовый магазин-производитель детской одежды из трикотажа. Производство находится в Пензе, ул. Терновского, 220. Работаем с оптовыми заказами и отправляем продукцию транспортными компаниями по России и СНГ.
          </p>

          <div className="contacts__details" aria-label="Контактная информация">
            <div className="contacts__detail">
              <span className="contacts__label">Телефон</span>
              <a href="tel:+79272876926" className="contacts__phone">
                +7&nbsp;(927)&nbsp;287-69-26
                <p>Наталья</p>
              </a>
            </div>

            <div className="contacts__detail">
              <span className="contacts__label">Почта</span>
              <a href="mailto:nataliya.abroskina@mail.ru" className="contacts__email">
                nataliya.abroskina@mail.ru
              </a>
            </div>

            <div className="contacts__detail">
              <span className="contacts__label">Реквизиты</span>
              <p>ИП СИВЕНКОВА К.А.</p>
              <p>ИНН 583715276582</p>
              <p>ОГРНИП 326580000023301</p>
            </div>
          </div>
        </section>

        <section className="contacts__map" aria-label="Производство на карте">
          <iframe
            className="contacts__map-iframe"
            title="Производство Кроха Трикотажевна на карте"
            src="https://yandex.ru/map-widget/v1/?ll=45.022493%2C53.135469&z=16&l=map&pt=45.022493,53.135469,pm2rdm"
            allowFullScreen
          />
        </section>

        <section className="contacts__order">
          <h2 className="contacts__title">Как заказать</h2>
          <p>
            Выберите нужные модели в каталоге или прайс-листе, подготовьте
            список позиций, размеров и цветов, а затем свяжитесь с нами по
            телефону или почте. Мы уточним наличие, сроки пошива, условия
            оплаты и доставки, после чего соберём заказ и передадим его в
            удобную транспортную компанию.
          </p>
        </section>
      </div>
    </main>
  )
}
