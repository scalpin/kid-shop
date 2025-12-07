import { notFound } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export const revalidate = 60

export async function generateStaticParams() {
  const { data } = await supabase.from("products").select("slug")
  return (data ?? []).map((p) => ({ slug: p.slug }))
}

export default async function ProductPage({ params }) {
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .single()

  if (error || !product) return notFound()

  // подготовим поля для вывода
  const fmt = new Intl.NumberFormat("ru-RU")
  const priceStr =
    product.price != null ? `${fmt.format(Number(product.price))} ₽` : "—"

  const sku = product.sku || "—"

  const sizes =
    Array.isArray(product.sizes)
      ? product.sizes.join(", ")
      : product.sizes || "—"

  const material = product.material || "—"

  const images = Array.isArray(product.images) ? product.images : []

  return (
    <main className="product">
      <div className="product__inner">

        {/* назад в каталог */}
        <div className="product__topbar">
          <Link href="/catalog" className="product__back">← Вернуться в каталог</Link>
        </div>

        <section className="product__grid">
          {/* галерея */}
          <div className="product__gallery">
            <img
              src={images[0] || "/placeholder.png"}
              alt={product.name}
              className="product__image"
            />
            {images.length > 1 && (
              <div className="product__thumbs">
                {images.slice(0, 5).map((src, i) => (
                  <a key={i} href={src} target="_blank" rel="noreferrer" className="product__thumb-link">
                    <img src={src} alt="" className="product__thumb" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* информация */}
          <div className="product__info">
            <h1 className="product__title">{product.name}</h1>

            <dl className="product__meta">
              <div className="product__meta-row">
                <dt>Артикул</dt>
                <dd>{sku}</dd>
              </div>
              <div className="product__meta-row">
                <dt>Размеры</dt>
                <dd>{sizes}</dd>
              </div>
              <div className="product__meta-row">
                <dt>Материал</dt>
                <dd>{material}</dd>
              </div>
              <div className="product__meta-row">
                <dt>Цена</dt>
                <dd className="product__price">{priceStr}</dd>
              </div>
            </dl>

            {product.description && (
              <div className="product__desc">
                <h2>Описание</h2>
                <p>{product.description}</p>
              </div>
            )}

            <div className="product__cta">
              Заказ по телефону:
              {" "}
              <a href="tel:+79273674519" className="product__cta-link">+7 927 367-45-19</a><br></br>
              <a href="tel:+79272876926" className="product__cta-link2">+7 927 287-69-26</a>
            </div>

            {Array.isArray(product.certificates) && product.certificates.length > 0 && (
              <div className="product__certs">
                <h3>Сертификаты</h3>
                <ul>
                  {product.certificates.slice(0, 5).map((url, idx) => (
                    <li key={idx}><a href={url} target="_blank" rel="noreferrer">Скачать {idx + 1}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
