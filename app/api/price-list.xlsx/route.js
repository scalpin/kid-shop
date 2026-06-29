import { listPriceProducts } from '@/lib/products'
import { createPriceListXlsx } from '@/lib/xlsx'

export const runtime = 'nodejs'

export async function GET() {
  const products = await listPriceProducts()
  const file = createPriceListXlsx(products)

  return new Response(file, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="price-list.xlsx"',
      'Cache-Control': 'no-store',
    },
  })
}
