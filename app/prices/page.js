// app/prices/page.js
import { supabase } from '@/lib/supabase'

export const revalidate = 60
export const metadata = { title: 'Прайс-лист' }

export default async function PricesPage() {
  const { data: products, error } = await supabase
    .from('products')
    .select('name, sku, material, sizes, price')
    .order('name', { ascending: true })

  if (error) {
    return <main className="price"><div className="price__inner"><pre className="price__error">{error.message}</pre></div></main>
  }

  const fmt = new Intl.NumberFormat('ru-RU')

  return (
    <main className="price">
      <div className="price__inner">
        <h1 className="price__h1">Прайс-лист</h1>
        <div className="price__note">Заказ по телефону: <a href="tel:+79273674519" className="price__phone">+7 (927) 367-45-19</a></div>

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
              {(products ?? []).map((p, i) => {
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
            <div className="export">
                <button type="button" className="export__btn">Выгрузить</button>
                <button
                    type="button"
                    className="export__toggle"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    aria-label="Выбрать формат"
                />
                <ul className="export__menu" role="menu">
                    <li><a href="#" role="menuitem" data-format="csv">CSV</a></li>
                    <li><a href="#" role="menuitem" data-format="xls">XLS</a></li>
                    <li><a href="#" role="menuitem" data-format="xml">XML</a></li>
                </ul>
            </div>
        </div>
      </div>
    </main>
  )
}
