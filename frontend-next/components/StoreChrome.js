'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Header from './Header'
import WhatsAppButton from './WhatsAppButton'
import BrandLockup from './BrandLockup'

const WHATSAPP = 'https://wa.me/254700532298'

export default function StoreChrome({ children }) {
  const pathname = usePathname() || ''
  const isNas = pathname === '/nas' || pathname.startsWith('/nas/')
  const isSell = pathname === '/sell' || pathname.startsWith('/sell/')

  if (isNas || isSell) {
    return <>{children}</>
  }

  const year = new Date().getFullYear()

  return (
    <div className="store-shell">
      <Header />
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div className="site-footer__brand">
            <BrandLockup light className="site-footer__logo" />
            <p className="site-footer__tagline">
              Farm products secured by Mercy Gold — honey, milk, and more.
            </p>
          </div>

          <div className="site-footer__divider" aria-hidden />

          <div className="site-footer__explore">
            <span className="site-footer__explore-label">Explore</span>
            <nav className="site-footer__links" aria-label="Footer">
              <Link href="/">Home</Link>
              <span className="site-footer__dot" aria-hidden>
                ·
              </span>
              <Link href="/shop">Shop</Link>
              <span className="site-footer__dot" aria-hidden>
                ·
              </span>
              <Link href="/sell/register">Sell</Link>
              <span className="site-footer__dot" aria-hidden>
                ·
              </span>
              <Link href="/about">Our Story</Link>
              <span className="site-footer__dot" aria-hidden>
                ·
              </span>
              <Link href="/terms">Terms</Link>
              <span className="site-footer__dot" aria-hidden>
                ·
              </span>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                Contact
              </a>
            </nav>
          </div>

          <div className="site-footer__divider" aria-hidden />

          <p className="site-footer__copy">
            © {year} Mercy Gold. All rights reserved.
          </p>
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  )
}
