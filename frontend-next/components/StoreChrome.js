'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import WhatsAppButton from './WhatsAppButton'

export default function StoreChrome({ children }) {
  const pathname = usePathname() || ''
  const isNas = pathname === '/nas' || pathname.startsWith('/nas/')

  if (isNas) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>
            © {new Date().getFullYear()} Mercy Gold Honey · Pure. Natural.
            Kenyan.
          </p>
          <nav className="site-footer__links" aria-label="Footer">
            <a href="/about">About</a>
            <a href="/faq">FAQ</a>
            <a href="/track">Track order</a>
            <a href="/shop">Shop</a>
          </nav>
        </div>
      </footer>
      <WhatsAppButton />
    </>
  )
}
