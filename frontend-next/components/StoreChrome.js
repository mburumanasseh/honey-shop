'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Header from './Header'
import WhatsAppButton from './WhatsAppButton'

const WHATSAPP = 'https://wa.me/254700532298'

export default function StoreChrome({ children }) {
  const pathname = usePathname() || ''
  const isNas = pathname === '/nas' || pathname.startsWith('/nas/')

  if (isNas) {
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
            <Link href="/" className="site-footer__logo" aria-label="Mercy Gold Honey home">
              <span className="site-footer__mark" aria-hidden>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3 19 7v4l-7 4-7-4V7l7-4Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 11v4l7 4 7-4v-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="site-footer__name">
                <strong>Mercy Gold</strong>
                <span>Honey</span>
              </span>
            </Link>
            <p className="site-footer__tagline">
              Nature&apos;s sweetest gift, straight from the hive.
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
              <Link href="/shop">Shop Honey</Link>
              <span className="site-footer__dot" aria-hidden>
                ·
              </span>
              <Link href="/about">Our Story</Link>
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
            © {year} Mercy Gold Honey. All rights reserved.
          </p>
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  )
}
