// app/page.js
import Link from 'next/link'

export const metadata = { title: 'Счастливчик — детская одежда оптом' }

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__text">
            <h1 className="hero__title">Детская одежда оптом</h1>
            <p className="hero__subtitle">От производителя. Быстрая отгрузка. Заказ по телефону</p>
            <div className="hero__actions">
              <Link href="/catalog" className="btn btn--primary">Смотреть каталог</Link>
              <Link href="/price-list" className="btn btn--ghost">Прайс-лист</Link>
            </div>
          </div>
          <div className="hero__img-wrap">
            <img src="/DSC_0983(rolled).jpg" alt="" className="hero__img" />
          </div>
        </div>
      </section>

      <section className="usp">
        <div className="usp__inner">
          <div className="usp__item"><strong>Собственное производство</strong><br/>стабильное качество</div>
          <div className="usp__item"><strong>Заказ от 3000</strong><br/>гибкие условия</div>
          <div className="usp__item"><strong>Быстрая логистика</strong><br/>по РФ и СНГ</div>
        </div>
      </section>
    </main>
  )
}
