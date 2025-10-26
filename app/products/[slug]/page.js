// app\products\[slug]\page.js
import { notFound } from "next/navigation"
// если настроен alias "@", оставляй так, если нет — замени на "../../lib/supabase"
import { supabase } from "@/lib/supabase"
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

export async function generateStaticParams() {
  const { data } = await supabase.from("products").select("slug")
  return (data ?? []).map(p => ({ slug: p.slug }))
}

export default async function ProductPage({ params }) {
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .single()

  if (!product) return notFound()

  return (
    <main className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-6">
      <img
        src={product.images?.[0] || "/placeholder.png"}
        alt={product.name}
        className="w-full h-80 object-cover rounded"
      />
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        {product.price != null && <div className="mt-2 text-lg">{Number(product.price)} ₽</div>}
        <p className="mt-4 whitespace-pre-wrap text-sm text-gray-800">{product.description || ""}</p>
        <div className="mt-6 p-4 bg-gray-50 rounded">
          Заказ по телефону: <a href="tel:+79990000000" className="underline">+7 999 000 00 00</a>
        </div>
      </div>
    </main>
  )
}
