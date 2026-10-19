'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { IconCart } from './Icons'
import BrandLockup from './BrandLockup'

function CartIcon({ count }) {
  return (
    <span className="cart-link" aria-label={`Cart${count ? `, ${count} items` : ''}`}>
      <IconCart size={22} className="cart-link__icon" />
      {count > 0 && <span className="cart-badge">{count > 99 ? '99+' : count}</span>}
    </span>
  )
}

export default function Header() {
  const { isAuthenticated, logout } = useAuth()
  const { cartCount } = useCart()
  const pathname = usePathname() || ''
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const authLinks = isAuthenticated ? (
    <>
      <Link href="/account" onClick={() => setMenuOpen(false)}>
        Account
      </Link>
      <Link href="/orders" onClick={() => setMenuOpen(false)}>
        Orders
      </Link>
      <button
        type="button"
        className="linkish"
        onClick={() => {
          setMenuOpen(false)
          logout()
        }}
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link href="/login" onClick={() => setMenuOpen(false)}>
        Login
      </Link>
      <Link
        href="/register"
        className="nav-cta"
        onClick={() => setMenuOpen(false)}
      >
        Register
      </Link>
    </>
  )

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <BrandLockup light className="brand" />

        <div className="site-header__actions">
          <Link href="/cart" className="cart-trigger" title="Cart">
            <CartIcon count={cartCount} />
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="site-nav-panel"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="nav-toggle__bars" data-open={menuOpen || undefined}>
              <span />
              <span />
              <span />
            </span>
          </button>

          <nav className="site-nav site-nav--desktop" aria-label="Main">
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/about">Our Story</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/track">Track</Link>
            {authLinks}
          </nav>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        className="nav-backdrop"
        data-open={menuOpen || undefined}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
      <nav
        id="site-nav-panel"
        className="site-nav-panel"
        data-open={menuOpen || undefined}
        aria-label="Mobile"
        aria-hidden={!menuOpen}
      >
        <Link href="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link href="/shop" onClick={() => setMenuOpen(false)}>
          Shop
        </Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>
          Our Story
        </Link>
        <Link href="/faq" onClick={() => setMenuOpen(false)}>
          FAQ
        </Link>
        <Link href="/track" onClick={() => setMenuOpen(false)}>
          Track order
        </Link>
        <Link href="/cart" onClick={() => setMenuOpen(false)}>
          Cart{cartCount > 0 ? ` (${cartCount})` : ''}
        </Link>
        {authLinks}
      </nav>
    </header>
  )
}
