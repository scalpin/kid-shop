import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage({ searchParams }) {
  if (await isAdminAuthenticated()) {
    redirect('/admin/products')
  }

  const resolvedSearchParams = await searchParams
  const hasError = resolvedSearchParams?.error === '1'
  const notConfigured = resolvedSearchParams?.error === 'not-configured'

  return (
    <main className="admin-login">
      <section className="admin-login__card">
        <p className="admin-eyebrow">Кроха Трикотажевна</p>
        <h1>Вход в админ-панель</h1>
        <p className="admin-muted">
          Управление каталогом, карточками товаров и фотографиями.
        </p>

        {hasError && (
          <div className="admin-alert admin-alert--error">
            Неверный пароль. Проверьте раскладку и попробуйте ещё раз.
          </div>
        )}

        {notConfigured && (
          <div className="admin-alert admin-alert--error">
            Пароль администратора не настроен на сервере.
          </div>
        )}

        <form className="admin-form" method="post" action="/admin/api/login">
          <label className="admin-field">
            <span>Пароль</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              autoFocus
            />
          </label>

          <button type="submit" className="admin-button admin-button--primary">
            Войти
          </button>
        </form>
      </section>
    </main>
  )
}
