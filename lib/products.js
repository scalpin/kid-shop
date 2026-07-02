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

function getSearchWords(search) {
  if (typeof search !== 'string') {
    return []
  }

  return search
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 120)
    .split(' ')
    .filter(Boolean)
    .slice(0, 8)
}

function buildProductSearchFilter(words, startIndex = 1) {
  if (words.length === 0) {
    return { sql: '', params: [] }
  }

  const searchText = "concat_ws(' ', name, sku, material, description, array_to_string(sizes, ' '))"
  const params = words.map((word) => `%${word}%`)
  const sql = words
    .map((_, index) => `${searchText} ILIKE $${startIndex + index}`)
    .join(' AND ')

  return { sql, params }
}

export async function listCatalogProducts({ search } = {}) {
  const words = getSearchWords(search)
  const filter = buildProductSearchFilter(words)
  const whereSearch = filter.sql ? `AND ${filter.sql}` : ''

  const { rows } = await query(
    `
      SELECT name, slug, sku, sizes, price, images
      FROM products
      WHERE is_active = TRUE
      ${whereSearch}
      ORDER BY created_at DESC, id DESC
    `,
    filter.params,
  )

  return rows.map(normalizeProduct)
}

export async function listSearchSuggestions(search, limit = 6) {
  const words = getSearchWords(search)

  if (words.length === 0) {
    return []
  }

  const safeLimit = Math.max(1, Math.min(Number(limit) || 6, 6))
  const filter = buildProductSearchFilter(words)
  const prefixParamIndex = filter.params.length + 1

  const { rows } = await query(
    `
      SELECT name, slug, price, images
      FROM products
      WHERE is_active = TRUE
      AND ${filter.sql}
      ORDER BY
        CASE WHEN name ILIKE $${prefixParamIndex} THEN 0 ELSE 1 END,
        name ASC
      LIMIT ${safeLimit}
    `,
    [...filter.params, `${words[0]}%`],
  )

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

export async function listProductsBySlugs(slugs) {
  const safeSlugs = [...new Set(
    (Array.isArray(slugs) ? slugs : [])
      .filter((slug) => typeof slug === 'string' && slug.trim())
      .map((slug) => slug.trim())
      .slice(0, 100),
  )]

  if (safeSlugs.length === 0) {
    return []
  }

  const { rows } = await query(
    `
      SELECT name, slug, price, images
      FROM products
      WHERE is_active = TRUE
      AND slug = ANY($1::text[])
    `,
    [safeSlugs],
  )

  const order = new Map(safeSlugs.map((slug, index) => [slug, index]))

  return rows
    .map(normalizeProduct)
    .sort((a, b) => order.get(a.slug) - order.get(b.slug))
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
