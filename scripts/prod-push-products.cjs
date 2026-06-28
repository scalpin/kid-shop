const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { spawn } = require('child_process')

const args = process.argv.slice(2)
const yes = args.includes('--yes') || process.env.CONFIRM_PROD_PUSH_PRODUCTS === '1'
const skipMedia = args.includes('--skip-media')

const sshTarget = process.env.KROHA_SSH_TARGET || 'root@157.22.190.39'
const remoteAppDir = process.env.KROHA_REMOTE_APP_DIR || '/var/www/kroha-trikotazhevna'
const remoteDumpPath = process.env.KROHA_REMOTE_DUMP_PATH || '/tmp/kroha-products-import.json'
const exportPath = path.join(process.cwd(), 'db', 'exports', 'products-for-prod.json')
const mediaDir = path.join(process.cwd(), 'public', 'uploads')

function asPortableRelativePath(filePath) {
  return path.relative(process.cwd(), filePath).split(path.sep).join('/')
}

function run(command, commandArgs, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, {
      stdio: 'inherit',
      shell: false,
      ...options,
    })

    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} exited with code ${code}`))
      }
    })

    child.on('error', reject)
  })
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

async function confirmProductionReplace() {
  if (yes) {
    return
  }

  console.log('')
  console.log('This will REPLACE the production products table with your local products export.')
  console.log(`Target: ${sshTarget}:${remoteAppDir}`)
  console.log('It will also upload public/uploads if that folder exists.')
  console.log('')

  const answer = await ask('Type PUSH PRODUCTS to continue: ')

  if (answer.trim() !== 'PUSH PRODUCTS') {
    throw new Error('Cancelled.')
  }
}

async function main() {
  await confirmProductionReplace()

  console.log('==> Exporting local products')
  await run(process.execPath, [
    path.join('scripts', 'db-export-products.cjs'),
    '--out',
    exportPath,
  ])

  console.log('==> Uploading products export to VPS')
  await run('scp', [asPortableRelativePath(exportPath), `${sshTarget}:${remoteDumpPath}`])

  if (!skipMedia && fs.existsSync(mediaDir)) {
    console.log('==> Uploading public/uploads to VPS')
    await run('ssh', [sshTarget, `mkdir -p '${remoteAppDir}/public'`])
    await run('scp', ['-r', asPortableRelativePath(mediaDir), `${sshTarget}:${remoteAppDir}/public/`])
  } else {
    console.log('==> public/uploads not found, media upload skipped')
  }

  console.log('==> Importing products on VPS')
  const remoteCommand = `
    set -euo pipefail
    cd '${remoteAppDir}'
    if [ ! -f scripts/db-import-products.cjs ]; then
      echo 'scripts/db-import-products.cjs is missing on VPS. Run deploy-kroha first.' >&2
      exit 2
    fi
    set -a
    . ./.env.production
    set +a
    CONFIRM_REPLACE_PRODUCTS=1 node scripts/db-import-products.cjs '${remoteDumpPath}' --yes
    chown -R kroha:kroha public/uploads 2>/dev/null || true
    systemctl restart kroha
    systemctl is-active kroha
  `

  await run('ssh', [sshTarget, remoteCommand])

  console.log('==> Production products are updated.')
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
