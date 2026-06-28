const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')
const { loadProjectEnv } = require('./load-env.cjs')

loadProjectEnv()

const DEFAULT_DATABASE_URL =
  'postgres://kroha:kroha_dev_password@localhost:55432/kroha_trikotazhevna'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const confirmed = args.includes('--yes') || process.env.CONFIRM_REPLACE_PRODUCTS === '1'
const inputPath = args.find((arg) => !arg.startsWith('--'))
const connectionString = process.env.DATABASE_URL || DEFAULT_DATABASE_URL
const ssl = process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false

function readProducts(filePath) {
  if (!filePath) {
    throw new Error('Usage: npm run db:import:products -- path/to/products.json --yes')
  }

  const payload = JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf8'))

  if (payload.type !== 'kroha-products-export' || !Array.isArray(payload.products)) {
    throw new Error('Invalid products export file.')
  }

  return payload.products
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : []
}

async function main() {
  const products = readProducts(inputPath)

  if (dryRun) {
    console.log(`Dry run OK: ${products.length} products found in export.`)
    return
  }

  if (!confirmed) {
    throw new Error(
      'This replaces the whole products table. Re-run with --yes or set CONFIRM_REPLACE_PRODUCTS=1.',
    )
  }

  const pool = new Pool({ connectionString, ssl })
  const schema = fs.readFileSync(path.join(process.cwd(), 'db', 'schema.sql'), 'utf8')

  try {
    await pool.query(schema)
    await pool.query('BEGIN')
    await pool.query('TRUNCATE TABLE products RESTART IDENTITY')

    for (let index = 0; index < products.length; index += 1) {
      const product = products[index]
      const id = product.id || index + 1

      await pool.query(
        `
          INSERT INTO products (
            id,
            name,
            slug,
            sku,
            material,
            sizes,
            price,
            description,
            images,
            certificates,
            is_active,
            created_at,
            updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
          )
        `,
        [
          id,
          product.name,
          product.slug,
          product.sku || null,
          product.material || null,
          normalizeArray(product.sizes),
          product.price === undefined ? null : product.price,
          product.description || null,
          normalizeArray(product.images),
          normalizeArray(product.certificates),
          product.is_active !== false,
          product.created_at || new Date().toISOString(),
          product.updated_at || new Date().toISOString(),
        ],
      )
    }

    await pool.query(`
      SELECT setval(
        pg_get_serial_sequence('products', 'id'),
        GREATEST(COALESCE(MAX(id), 1), 1),
        COUNT(*) > 0
      )
      FROM products
    `)
    await pool.query('COMMIT')

    console.log(`Imported ${products.length} products.`)
  } catch (error) {
    await pool.query('ROLLBACK').catch(() => {})
    throw error
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
