import FavoritesClient from './FavoritesClient'

export const metadata = {
  title: 'Избранное',
  robots: {
    index: false,
    follow: false,
  },
}

export default function FavoritesPage() {
  return (
    <main className="favorites-page">
      <FavoritesClient />
    </main>
  )
}
