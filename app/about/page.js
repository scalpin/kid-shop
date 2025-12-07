// app/about/page.js
export const metadata = { title: 'О компании' }

export default function AboutPage() {
  return (
    <main className="about">
      <div className="about__inner">

        {/* Блок 1: изображение слева, текст справа */}
        <section className="about-section">
          <div className="about-section__image">
            <img src="/about/market.jpg" alt="Наше производство" />
          </div>
          <div className="about-section__content">
            <h2 className="about-section__title">На рынке с 2012 года</h2>
            <p>
              Мы начали как небольшое производство детской одежды и за годы работы выстроили стабильные поставки и аккуратный контроль качества. Работаем напрямую без посредников, поддерживаем регулярные коллекции и базовые модели
            </p>
          </div>
        </section>

        {/* Блок 2: изображение справа, текст слева */}
        <section className="about-section">
          <div className="about-section__image__reflected">
            <img src="/about/penza.jpg" alt="Пенза" />
          </div>
          <div className="about-section__content__reflected">
            <h2 className="about-section__title__reflected">Производство в Пензе</h2>
            <p>
              Производство и склад находятся в Пензе. Полный цикл в одном месте — раскрой, пошив, упаковка — контролируем партию от полотна до коробки и учтиво относимся к запросам по заказу
            </p>
          </div>
        </section>

        {/* Блок 3: произвольный текстовый блок (по желанию можно убрать) */}
        <section className="about-section">
          <div className="about-section__image">
            <img src="/about/quality.jpg" alt="Качество" />
          </div>
          <div className="about-section__content">
            <h2 className="about-section__title">Высокое качество</h2>
            <p>
              Используем мягкий хлопковый трикотаж, проверенную фурнитуру и безопасные красители. Модели тестируем на усадку и стойкость швов
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
