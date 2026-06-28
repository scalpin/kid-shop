const { Pool } = require('pg')
const { loadProjectEnv } = require('./load-env.cjs')

loadProjectEnv()

const DEFAULT_DATABASE_URL =
  'postgres://kroha:kroha_dev_password@localhost:55432/kroha_trikotazhevna'

const args = process.argv.slice(2)
const confirmed = args.includes('--yes') || process.env.CONFIRM_CLEAR_PRODUCTS === '1'
const connectionString = process.env.DATABASE_URL || DEFAULT_DATABASE_URL
const ssl = process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false

async function main() {
  if (!confirmed) {
    throw new Error(
      'This clears all rows from products. Re-run with -- --yes or set CONFIRM_CLEAR_PRODUCTS=1.',
    )
  }

  const pool = new Pool({ connectionString, ssl })

  try {
    await pool.query('TRUNCATE TABLE products RESTART IDENTITY')
    console.log('Products table is empty.')
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
