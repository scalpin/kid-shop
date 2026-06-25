import pg from 'pg'

const { Pool } = pg

const DEFAULT_DATABASE_URL =
  'postgres://kroha:kroha_dev_password@localhost:55432/kroha_trikotazhevna'

function getConnectionString() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  if (process.env.NODE_ENV !== 'production') {
    return DEFAULT_DATABASE_URL
  }

  throw new Error('DATABASE_URL is not configured')
}

function getSslConfig() {
  return process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
}

export function getPool() {
  if (!globalThis.__krohaPgPool) {
    globalThis.__krohaPgPool = new Pool({
      connectionString: getConnectionString(),
      ssl: getSslConfig(),
    })
  }

  return globalThis.__krohaPgPool
}

export async function query(text, params = []) {
  return getPool().query(text, params)
}
