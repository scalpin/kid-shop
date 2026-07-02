export const metadata = {
  title: 'Админ-панель — Кроха Трикотажевна',
}

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      {children}
    </div>
  )
}
