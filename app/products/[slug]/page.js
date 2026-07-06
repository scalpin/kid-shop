import { notFound } from "next/navigation"
import Link from "next/link"
import FavoriteButton from "@/app/components/FavoriteButton"
import { getProductBySlug, listProductSlugs } from "@/lib/products"
import {
  SITE_NAME,
  SITE_PHONE,
  absoluteUrl,
  createJsonLdMarkup,
} from "@/lib/seo"

export const runtime = "nodejs"
export const revalidate = 60

export async function generateStaticParams() {
  try {
    const products = await listProductSlugs()
    return products.map((p) => ({ slug: p.slug }))
  } catch (error) {
    console.error("Failed to generate product params:", error)
    return []
  }
}

function formatProductSizes(product) {
  if (Array.isArray(product?.sizes)) {
    return product.sizes.join(", ")
  }

  return product?.sizes || ""
}

function buildProductSeoDescription(product) {
  const parts = [
    product?.name,
    product?.sku ? `артикул ${product.sku}` : '',
    formatProductSizes(product) ? `размеры ${formatProductSizes(product)}` : '',
    product?.material ? `материал ${product.material}` : '',
    product?.price != null ? `цена ${Number(product.price)} ₽` : '',
    'детская ясельная одежда оптом от производителя в Пензе',
  ].filter(Boolean)

  return parts.join(', ').slice(0, 260)
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Товар не найден',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const image = product.images?.[0] || '/logo_blue(cuted).png'
  const title = `${product.name}${product.sku ? ` ${product.sku}` : ''} — купить оптом`
  const description = buildProductSeoDescription(product)

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/products/${product.slug}`,
      images: [
        {
          url: image,
          alt: product.name,
        },
      ],
    },
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) return notFound()

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
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku || undefined,
    image: (images.length > 0 ? images : ['/logo_blue(cuted).png']).map(absoluteUrl),
    description: buildProductSeoDescription(product),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    manufacturer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: absoluteUrl('/'),
      telephone: SITE_PHONE,
    },
    material: product.material || undefined,
    offers: product.price != null
      ? {
          '@type': 'Offer',
          url: absoluteUrl(`/products/${product.slug}`),
          priceCurrency: 'RUB',
          price: Number(product.price),
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: SITE_NAME,
          },
        }
      : undefined,
  }

  return (
    <main className="product">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={createJsonLdMarkup(productJsonLd)}
      />
      <div className="product__inner">

        {/* назад в каталог */}
        <div className="product__topbar">
          <Link href="/catalog" className="product__back">← Вернуться в каталог</Link>
        </div>

        <section className="product__grid">
          {/* галерея */}
          <div className="product__gallery">
            <img
              src={images[0] || "/logo_blue(cuted).png"}
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
            <div className="product__title-row">
              <h1 className="product__title">{product.name}</h1>
              <FavoriteButton slug={product.slug} name={product.name} variant="product" />
            </div>

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

            <p>Расцветки в ассортименте</p>

            {product.description && (
              <div className="product__desc">
                <h2>Описание</h2>
                <p>{product.description}</p>
              </div>
            )}

            <div className="product__cta">
              Заказ по телефону:
              {" "}
              <a href="tel:+79272876926" className="product__cta-link">+7 927 287-69-26</a>
            </div>

            {Array.isArray(product.certificates) && product.certificates.length > 0 && (
              <div className="product__certs">
                <h3>Документы</h3>
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
