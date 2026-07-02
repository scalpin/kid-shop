import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { setProductActive } from '@/lib/admin-products'
import { getAdminRedirectUrl } from '@/lib/admin-redirect'

export const runtime = 'nodejs'

export async function POST(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(getAdminRedirectUrl(request, '/admin/login'), { status: 303 })
  }

  const { id } = await params
  const formData = await request.formData()
  const product = await setProductActive(id, formData.get('is_active') === 'true')

  if (product) {
    revalidatePath('/catalog')
    revalidatePath('/prices')
    revalidatePath(`/products/${product.slug}`)
  }

  return NextResponse.redirect(getAdminRedirectUrl(request, '/admin/products?saved=1'), {
    status: 303,
  })
}
