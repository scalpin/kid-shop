// app/prices/page.js
import { listPriceProducts } from '@/lib/products'

export const runtime = 'nodejs'
export const revalidate = 60
export const metadata = { title: 'Прайс-лист' }

export default async function PricesPage() {
  let products = []

  try {
    products = await listPriceProducts()
  } catch (error) {
    return <main className="price"><div className="price__inner"><pre className="price__error">{error.message}</pre></div></main>
  }

  const fmt = new Intl.NumberFormat('ru-RU')

  return (
    <main className="price">
      <div className="price__inner">
        <h1 className="price__h1">Прайс-лист</h1>
        <div className="price__note">Заказ по телефону: <a href="tel:+79272876926" className="price__phone">+7 (927) 287-69-26</a></div>

        <div className="price__tablewrap">
          <table className="price-table">
            <thead>
              <tr>
                <th>Артикул</th>
                <th>Наименование</th>
                <th>Размеры</th>
                <th>Материал</th>
                <th className="col-price">Цена</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const sizes = Array.isArray(p.sizes) ? p.sizes.join(', ') : (p.sizes || '—')
                const price = p.price != null ? `${fmt.format(Number(p.price))} ₽` : '—'
                return (
                  <tr key={`${p.sku || p.name}-${i}`}>
                    <td className="cell-sku">{p.sku || '—'}</td>
                    <td className="cell-name">{p.name || '—'}</td>
                    <td className="cell-sizes">{sizes}</td>
                    <td className="cell-material">{p.material || '—'}</td>
                    <td className="cell-price">{price}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="price__footer-note">Цены указаны в рублях. Актуальность обновляется автоматически</div>

        <div className="price__export">
          <a
            href="/api/price-list.xlsx"
            download="price-list.xlsx"
            className="export__btn"
          >
            Выгрузить
          </a>
        </div>
      </div>
    </main>
  )
}
