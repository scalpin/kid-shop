import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import {
  getAdminProductById,
  normalizeProductInput,
  parseProductFormData,
  updateProduct,
} from '@/lib/admin-products'
import { getAdminRedirectUrl } from '@/lib/admin-redirect'
import { saveProductImages } from '@/lib/admin-uploads'

export const runtime = 'nodejs'

function redirectToLogin(request) {
  return NextResponse.redirect(getAdminRedirectUrl(request, '/admin/login'), { status: 303 })
}

export async function POST(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return redirectToLogin(request)
  }

  const { id } = await params
  const existingProduct = await getAdminProductById(id)

  if (!existingProduct) {
    return NextResponse.redirect(getAdminRedirectUrl(request, '/admin/products'), { status: 303 })
  }

  try {
    const formData = await request.formData()
    const input = await normalizeProductInput(parseProductFormData(formData), id)
    const uploadedImages = await saveProductImages(formData.getAll('images_upload'), input.slug)
    const product = await updateProduct(id, {
      ...input,
      images: [...input.images, ...uploadedImages],
    })

    revalidatePath('/catalog')
    revalidatePath('/prices')
    revalidatePath(`/products/${existingProduct.slug}`)
    revalidatePath(`/products/${product.slug}`)

    return NextResponse.redirect(getAdminRedirectUrl(request, `/admin/products/${product.id}?saved=1`), {
      status: 303,
    })
  } catch (error) {
    const url = getAdminRedirectUrl(request, `/admin/products/${id}`)
    url.searchParams.set('error', error.message || 'Не удалось сохранить товар')
    return NextResponse.redirect(url, { status: 303 })
  }
}
