const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')
const { loadProjectEnv } = require('./load-env.cjs')

loadProjectEnv()

const DEFAULT_DATABASE_URL =
  'postgres://kroha:kroha_dev_password@localhost:55432/kroha_trikotazhevna'

const args = process.argv.slice(2)
const outIndex = args.indexOf('--out')
const positionalOut = args.find((arg) => !arg.startsWith('--'))
const explicitOut = outIndex !== -1 ? args[outIndex + 1] : positionalOut
const connectionString = process.env.DATABASE_URL || DEFAULT_DATABASE_URL
const ssl = process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false

function defaultOutputPath() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  return path.join(process.cwd(), 'db', 'exports', `products-${stamp}.json`)
}

async function main() {
  const pool = new Pool({ connectionString, ssl })
  const outputPath = path.resolve(explicitOut || defaultOutputPath())

  try {
    const { rows } = await pool.query(`
      SELECT
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
      FROM products
      ORDER BY created_at ASC, id ASC
    `)

    const payload = {
      version: 1,
      type: 'kroha-products-export',
      exportedAt: new Date().toISOString(),
      count: rows.length,
      products: rows,
    }

    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

    console.log(`Exported ${rows.length} products to ${outputPath}`)
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
