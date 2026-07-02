const crypto = require('node:crypto')

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function hashPassword(password) {
  const iterations = 310000
  const salt = crypto.randomBytes(16)
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256')

  return [
    'pbkdf2_sha256',
    String(iterations),
    base64url(salt),
    base64url(hash),
  ].join('$')
}

const password = process.argv[2]

if (!password) {
  console.error('Usage: node scripts/admin-password-hash.cjs "your admin password"')
  process.exit(1)
}

console.log(`ADMIN_PASSWORD_HASH=${hashPassword(password)}`)
console.log(`ADMIN_SESSION_SECRET=${base64url(crypto.randomBytes(32))}`)
