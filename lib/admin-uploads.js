import crypto from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const MAX_IMAGE_SIZE = 8 * 1024 * 1024
const MAX_IMAGE_COUNT = 8

const IMAGE_EXTENSIONS = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
])

function getUploadRoot() {
  return process.env.ADMIN_UPLOAD_DIR
    ? path.resolve(process.env.ADMIN_UPLOAD_DIR)
    : path.join(process.cwd(), 'public', 'uploads')
}

function safeSegment(value) {
  return String(value || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'product'
}

function getImageExtension(file) {
  const byType = IMAGE_EXTENSIONS.get(file.type)

  if (byType) {
    return byType
  }

  const ext = path.extname(file.name || '').replace('.', '').toLowerCase()

  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
    return ext === 'jpeg' ? 'jpg' : ext
  }

  return null
}

function normalizeUploadFiles(files) {
  return files
    .filter((file) => file && typeof file.arrayBuffer === 'function' && file.size > 0)
    .slice(0, MAX_IMAGE_COUNT)
}

export async function saveProductImages(files, slug) {
  const normalizedFiles = normalizeUploadFiles(files)

  if (normalizedFiles.length === 0) {
    return []
  }

  const productFolder = safeSegment(slug)
  const uploadRoot = getUploadRoot()
  const targetDir = path.join(uploadRoot, 'products', productFolder)
  const publicPrefix = process.env.ADMIN_UPLOAD_PUBLIC_PREFIX || '/uploads'

  await mkdir(targetDir, { recursive: true })

  const paths = []

  for (const file of normalizedFiles) {
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error(`Файл «${file.name || 'без имени'}» больше 8 МБ.`)
    }

    const extension = getImageExtension(file)

    if (!extension) {
      throw new Error('Можно загружать только изображения: jpg, png, webp или gif.')
    }

    const filename = `${Date.now()}-${crypto.randomBytes(5).toString('hex')}.${extension}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await writeFile(path.join(targetDir, filename), buffer, { flag: 'wx' })
    paths.push(`${publicPrefix}/products/${productFolder}/${filename}`)
  }

  return paths
}
