const fs = require('fs')
const path = require('path')

function parseEnvValue(value) {
  const trimmed = value.trim()

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }

  return trimmed
}

function loadEnvFile(filename) {
  const fullPath = path.join(process.cwd(), filename)

  if (!fs.existsSync(fullPath)) {
    return
  }

  const content = fs.readFileSync(fullPath, 'utf8')

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (!line || line.startsWith('#')) {
      continue
    }

    const separator = line.indexOf('=')

    if (separator === -1) {
      continue
    }

    const key = line.slice(0, separator).trim()
    const value = parseEnvValue(line.slice(separator + 1))

    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

function loadProjectEnv() {
  loadEnvFile('.env.local')
  loadEnvFile('.env')
}

module.exports = { loadProjectEnv }
