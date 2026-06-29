import FavoritesClient from './FavoritesClient'

export const metadata = { title: 'Избранное' }

export default function FavoritesPage() {
  return (
    <main className="favorites-page">
      <FavoritesClient />
    </main>
  )
}
