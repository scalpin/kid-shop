export const metadata = {
  title: 'Админ-панель — Кроха Трикотажевна',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      {children}
    </div>
  )
}
