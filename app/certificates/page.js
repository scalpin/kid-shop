export const metadata = {
  title: 'Документы',
  description:
    'Документы и сертификаты производителя детской одежды Кроха Трикотажевна.',
  alternates: {
    canonical: '/certificates',
  },
}

const mainDocuments = [
  'Свидетельство',
  'Декларация',
  'Протокол испытаний',
]

const sanitaryDocuments = Array.from({ length: 3 })

export default function CertificatesPage() {
  return (
    <main className="documents-page">
      <section className="documents-page__inner" aria-label="Документы">
        <div className="documents-grid documents-grid--top">
          {mainDocuments.map((title) => (
            <article className="documents-card" key={title}>
              <h2 className="documents-card__title">{title}</h2>
              <div className="documents-card__placeholder" aria-hidden="true" />
            </article>
          ))}
        </div>

        <section className="documents-section" aria-labelledby="sanitary-documents-title">
          <h2 className="documents-section__title" id="sanitary-documents-title">
            Санитарно-эпидемиологическое заключение
          </h2>

          <div className="documents-grid">
            {sanitaryDocuments.map((_, index) => (
              <article className="documents-card documents-card--blank" key={index}>
                <div className="documents-card__placeholder" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
