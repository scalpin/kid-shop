import { query } from './db'

function normalizeProduct(product) {
  if (!product) {
    return null
  }

  return {
    ...product,
    price: product.price === null || product.price === undefined ? null : Number(product.price),
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    images: Array.isArray(product.images) ? product.images : [],
    certificates: Array.isArray(product.certificates) ? product.certificates : [],
  }
}

export async function listCatalogProducts() {
  const { rows } = await query(`
    SELECT name, slug, price, images
    FROM products
    WHERE is_active = TRUE
    ORDER BY created_at DESC, id DESC
  `)

  return rows.map(normalizeProduct)
}

export async function listPriceProducts() {
  const { rows } = await query(`
    SELECT name, sku, material, sizes, price
    FROM products
    WHERE is_active = TRUE
    ORDER BY name ASC
  `)

  return rows.map(normalizeProduct)
}

export async function listProductSlugs() {
  const { rows } = await query(`
    SELECT slug
    FROM products
    WHERE is_active = TRUE
    ORDER BY created_at DESC, id DESC
  `)

  return rows
}

export async function getProductBySlug(slug) {
  const { rows } = await query(
    `
      SELECT *
      FROM products
      WHERE slug = $1 AND is_active = TRUE
      LIMIT 1
    `,
    [slug],
  )

  return normalizeProduct(rows[0])
}
