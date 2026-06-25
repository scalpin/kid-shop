const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')
const { loadProjectEnv } = require('./load-env.cjs')

loadProjectEnv()

const DEFAULT_DATABASE_URL =
  'postgres://kroha:kroha_dev_password@localhost:55432/kroha_trikotazhevna'

const connectionString = process.env.DATABASE_URL || DEFAULT_DATABASE_URL
const ssl = process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false

async function main() {
  const pool = new Pool({ connectionString, ssl })
  const schema = fs.readFileSync(path.join(process.cwd(), 'db', 'schema.sql'), 'utf8')

  try {
    await pool.query(schema)
    console.log('Database schema is ready.')
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
