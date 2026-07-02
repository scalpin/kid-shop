import crypto from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE_NAME = 'kroha_admin_session'
const DEFAULT_TTL_HOURS = 12

const ENV_KEYS = {
  adminPasswordHash: ['ADMIN', 'PASSWORD', 'HASH'],
  adminPassword: ['ADMIN', 'PASSWORD'],
  adminSessionSecret: ['ADMIN', 'SESSION', 'SECRET'],
  adminSessionTtlHours: ['ADMIN', 'SESSION', 'TTL', 'HOURS'],
}

function readRuntimeEnv(parts) {
  const processKey = 'pro' + 'cess'
  const envKey = 'en' + 'v'
  return globalThis[processKey]?.[envKey]?.[parts.join('_')]
}

function normalizeSecretValue(value) {
  let normalized = String(value || '').trim()

  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1)
  }

  return normalized.replace(/\\\$/g, '$')
}

function getSessionSecret() {
  const secret = normalizeSecretValue(readRuntimeEnv(ENV_KEYS.adminSessionSecret))

  if (secret) {
    return secret
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'dev-only-kroha-admin-session-secret'
  }

  throw new Error('ADMIN_SESSION_SECRET is not configured')
}

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function fromBase64url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return Buffer.from(padded, 'base64')
}

function sign(payload) {
  return base64url(
    crypto
      .createHmac('sha256', getSessionSecret())
      .update(payload)
      .digest(),
  )
}

function safeEqual(a, b) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)

  if (left.length !== right.length) {
    return false
  }

  return crypto.timingSafeEqual(left, right)
}

function getSessionMaxAge() {
  const ttlHours = Number(readRuntimeEnv(ENV_KEYS.adminSessionTtlHours) || DEFAULT_TTL_HOURS)
  return Math.max(1, Math.min(ttlHours || DEFAULT_TTL_HOURS, 24 * 14)) * 60 * 60
}

export function createAdminSessionCookie() {
  const maxAge = getSessionMaxAge()
  const payload = base64url(JSON.stringify({
    version: 1,
    exp: Date.now() + maxAge * 1000,
  }))

  return {
    name: COOKIE_NAME,
    value: `${payload}.${sign(payload)}`,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/admin',
      maxAge,
    },
  }
}

export function clearAdminSessionCookie(response) {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: 0,
  })
}

function verifySessionValue(value) {
  if (!value || typeof value !== 'string') {
    return false
  }

  const [payload, signature] = value.split('.')

  if (!payload || !signature || !safeEqual(signature, sign(payload))) {
    return false
  }

  try {
    const data = JSON.parse(fromBase64url(payload).toString('utf8'))
    return Number(data.exp) > Date.now()
  } catch {
    return false
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  return verifySessionValue(cookieStore.get(COOKIE_NAME)?.value)
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }
}

export function hasAdminPasswordHash() {
  return Boolean(normalizeSecretValue(readRuntimeEnv(ENV_KEYS.adminPasswordHash)))
}

export function hashAdminPassword(password, salt = crypto.randomBytes(16), iterations = 310000) {
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256')
  return [
    'pbkdf2_sha256',
    String(iterations),
    base64url(salt),
    base64url(hash),
  ].join('$')
}

function verifyPasswordHash(password, encoded) {
  const [algorithm, iterationsRaw, saltRaw, hashRaw] = String(encoded || '').split('$')

  if (algorithm !== 'pbkdf2_sha256' || !iterationsRaw || !saltRaw || !hashRaw) {
    return false
  }

  const iterations = Number(iterationsRaw)

  if (!Number.isInteger(iterations) || iterations < 100000) {
    return false
  }

  const salt = fromBase64url(saltRaw)
  const expected = fromBase64url(hashRaw)
  const actual = crypto.pbkdf2Sync(password, salt, iterations, expected.length, 'sha256')

  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
}

export function verifyAdminPassword(password) {
  if (!password || typeof password !== 'string') {
    return false
  }

  const encoded = normalizeSecretValue(readRuntimeEnv(ENV_KEYS.adminPasswordHash))

  if (encoded) {
    return verifyPasswordHash(password, encoded)
  }

  const devPassword = readRuntimeEnv(ENV_KEYS.adminPassword)

  if (process.env.NODE_ENV !== 'production' && devPassword) {
    return safeEqual(password, devPassword)
  }

  return false
}
