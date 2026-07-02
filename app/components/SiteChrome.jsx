'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import MainMenu from './MainMenu'
import Footer from './Footer'

export default function SiteChrome({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return children
  }

  return (
    <>
      <Header />
      <MainMenu />
      {children}
      <Footer />
    </>
  )
}
