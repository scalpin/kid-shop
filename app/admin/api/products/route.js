import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import {
  createProduct,
  normalizeProductInput,
  parseProductFormData,
} from '@/lib/admin-products'
import { getAdminRedirectUrl } from '@/lib/admin-redirect'
import { saveProductImages } from '@/lib/admin-uploads'

export const runtime = 'nodejs'

function redirectToLogin(request) {
  return NextResponse.redirect(getAdminRedirectUrl(request, '/admin/login'), { status: 303 })
}

function redirectWithError(request, message) {
  const url = getAdminRedirectUrl(request, '/admin/products/new')
  url.searchParams.set('error', message)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request) {
  if (!(await isAdminAuthenticated())) {
    return redirectToLogin(request)
  }

  try {
    const formData = await request.formData()
    const input = await normalizeProductInput(parseProductFormData(formData))
    const uploadedImages = await saveProductImages(formData.getAll('images_upload'), input.slug)
    const product = await createProduct({
      ...input,
      images: [...input.images, ...uploadedImages],
    })

    revalidatePath('/catalog')
    revalidatePath('/prices')
    revalidatePath(`/products/${product.slug}`)

    return NextResponse.redirect(getAdminRedirectUrl(request, `/admin/products/${product.id}?saved=1`), {
      status: 303,
    })
  } catch (error) {
    return redirectWithError(request, error.message || 'Не удалось создать товар')
  }
}
