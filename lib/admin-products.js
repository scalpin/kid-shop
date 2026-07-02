import { query } from './db'

const CYRILLIC_MAP = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
}

export function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .split('')
    .map((char) => CYRILLIC_MAP[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

function normalizeProduct(product) {
  if (!product) {
    return null
  }

  return {
    ...product,
    id: String(product.id),
    price: product.price === null || product.price === undefined ? '' : Number(product.price),
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    images: Array.isArray(product.images) ? product.images : [],
    certificates: Array.isArray(product.certificates) ? product.certificates : [],
  }
}

function splitList(value) {
  return String(value || '')
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function splitLines(value) {
  return String(value || '')
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function parsePrice(value) {
  const trimmed = String(value || '').trim().replace(',', '.')

  if (!trimmed) {
    return null
  }

  const price = Number(trimmed)

  if (!Number.isFinite(price) || price < 0) {
    throw new Error('Цена должна быть положительным числом.')
  }

  return price
}

export function parseProductFormData(formData) {
  return {
    name: String(formData.get('name') || '').trim(),
    slug: slugify(formData.get('slug')),
    sku: String(formData.get('sku') || '').trim() || null,
    material: String(formData.get('material') || '').trim() || null,
    sizes: splitList(formData.get('sizes')),
    price: parsePrice(formData.get('price')),
    description: String(formData.get('description') || '').trim() || null,
    images: splitLines(formData.get('images')),
    certificates: splitLines(formData.get('certificates')),
    is_active: formData.get('is_active') === 'on',
  }
}

async function ensureUniqueSlug(baseSlug, currentId = null) {
  const base = slugify(baseSlug) || 'product'
  let candidate = base
  let index = 2

  while (true) {
    const { rows } = await query(
      `
        SELECT id
        FROM products
        WHERE slug = $1
        AND ($2::bigint IS NULL OR id <> $2::bigint)
        LIMIT 1
      `,
      [candidate, currentId],
    )

    if (rows.length === 0) {
      return candidate
    }

    candidate = `${base}-${index}`
    index += 1
  }
}

export async function normalizeProductInput(input, currentId = null) {
  if (!input.name) {
    throw new Error('Название товара обязательно.')
  }

  return {
    ...input,
    slug: await ensureUniqueSlug(input.slug || input.name, currentId),
  }
}

export async function listAdminProducts({ search } = {}) {
  const searchText = String(search || '').trim()
  const params = []
  let where = ''

  if (searchText) {
    params.push(`%${searchText}%`)
    where = `
      WHERE concat_ws(
        ' ',
        name,
        slug,
        sku,
        material,
        description,
        array_to_string(sizes, ' ')
      ) ILIKE $1
    `
  }

  const { rows } = await query(
    `
      SELECT *
      FROM products
      ${where}
      ORDER BY is_active DESC, updated_at DESC, id DESC
    `,
    params,
  )

  return rows.map(normalizeProduct)
}

export async function getAdminProductById(id) {
  const { rows } = await query(
    `
      SELECT *
      FROM products
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  )

  return normalizeProduct(rows[0])
}

export async function createProduct(input) {
  const { rows } = await query(
    `
      INSERT INTO products (
        name,
        slug,
        sku,
        material,
        sizes,
        price,
        description,
        images,
        certificates,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5::text[], $6, $7, $8::text[], $9::text[], $10)
      RETURNING *
    `,
    [
      input.name,
      input.slug,
      input.sku,
      input.material,
      input.sizes,
      input.price,
      input.description,
      input.images,
      input.certificates,
      input.is_active,
    ],
  )

  return normalizeProduct(rows[0])
}

export async function updateProduct(id, input) {
  const { rows } = await query(
    `
      UPDATE products
      SET
        name = $2,
        slug = $3,
        sku = $4,
        material = $5,
        sizes = $6::text[],
        price = $7,
        description = $8,
        images = $9::text[],
        certificates = $10::text[],
        is_active = $11
      WHERE id = $1
      RETURNING *
    `,
    [
      id,
      input.name,
      input.slug,
      input.sku,
      input.material,
      input.sizes,
      input.price,
      input.description,
      input.images,
      input.certificates,
      input.is_active,
    ],
  )

  return normalizeProduct(rows[0])
}

export async function setProductActive(id, isActive) {
  const { rows } = await query(
    `
      UPDATE products
      SET is_active = $2
      WHERE id = $1
      RETURNING *
    `,
    [id, isActive],
  )

  return normalizeProduct(rows[0])
}
