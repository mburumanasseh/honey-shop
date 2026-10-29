'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import {
  IconArrowLeft,
  IconGrid,
  IconHoney,
  IconLayers,
  IconList,
  IconSettings,
  IconUsers,
  IconWallet,
} from '../Icons'

const NAV = [
  { href: '/nas', label: 'Dashboard', Icon: IconGrid, end: true },
  { href: '/nas/products', label: 'Products', Icon: IconHoney },
  { href: '/nas/approvals', label: 'Approvals', Icon: IconList },
  { href: '/nas/farmers', label: 'Farmers', Icon: IconUsers },
  { href: '/nas/orders', label: 'Orders', Icon: IconList },
  { href: '/nas/customers', label: 'Customers', Icon: IconUsers },
  { href: '/nas/inventory', label: 'Inventory', Icon: IconLayers },
  { href: '/nas/payments', label: 'Payments', Icon: IconWallet },
]

function linkActive(pathname, href, end) {
  if (end) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

function SidebarNav({ pathname, onNavigate }) {
  return (
    <>
      <nav className="admin-sidebar__nav" aria-label="Admin navigation">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              linkActive(pathname, item.href, item.end)
                ? 'admin-sidebar__link active'
                : 'admin-sidebar__link'
            }
            onClick={onNavigate}
          >
            <span className="admin-sidebar__icon">
              <item.Icon size={18} />
            </span>
            <span className="admin-sidebar__label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar__bottom">
        <Link
          href="/nas/settings"
          className={
            linkActive(pathname, '/nas/settings')
              ? 'admin-sidebar__link active'
              : 'admin-sidebar__link'
          }
          onClick={onNavigate}
        >
          <span className="admin-sidebar__icon">
            <IconSettings size={18} />
          </span>
          <span className="admin-sidebar__label">Settings</span>
        </Link>
        <Link href="/" className="admin-sidebar__link" onClick={onNavigate}>
          <span className="admin-sidebar__icon">
            <IconArrowLeft size={18} />
          </span>
          <span className="admin-sidebar__label">Back to Shop</span>
        </Link>
      </div>
    </>
  )
}

export default function NasShell({ children }) {
  const pathname = usePathname() || ''
  const { currentUser, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const initial = (currentUser?.name || currentUser?.email || 'A')
    .charAt(0)
    .toUpperCase()

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

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="admin-layout">
      {/* Desktop sidebar */}
      <aside className="admin-sidebar admin-sidebar--desktop">
        <div className="admin-sidebar__brand">
          <Link
            href="/nas"
            className="admin-sidebar__brand-link"
            aria-label="Mercy Gold console"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mercy-gold-logo.jpg"
              alt="Mercy Gold"
              className="admin-sidebar__logo"
            />
          </Link>
          <span className="admin-sidebar__badge">Admin</span>
        </div>
        <SidebarNav pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      <div
        className="admin-nav-backdrop"
        data-open={menuOpen || undefined}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />
      <aside
        className="admin-sidebar admin-sidebar--drawer"
        data-open={menuOpen || undefined}
        aria-hidden={!menuOpen}
      >
        <div className="admin-sidebar__brand">
          <Link
            href="/nas"
            className="admin-sidebar__brand-link"
            onClick={closeMenu}
            aria-label="Mercy Gold console"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mercy-gold-logo.jpg"
              alt="Mercy Gold"
              className="admin-sidebar__logo"
            />
          </Link>
          <span className="admin-sidebar__badge">Admin</span>
        </div>
        <SidebarNav pathname={pathname} onNavigate={closeMenu} />
      </aside>

      <div className="admin-layout__main">
        <header className="admin-header">
          <div className="admin-header__left">
            <button
              type="button"
              className="admin-menu-toggle"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="admin-menu-toggle__bars" data-open={menuOpen || undefined}>
                <span />
                <span />
                <span />
              </span>
            </button>
            <div className="admin-header__title">
              <span>Mercy Gold</span>
              <h1>Admin</h1>
            </div>
          </div>
          <div className="admin-header__user">
            <div className="admin-header__avatar" aria-hidden>
              {initial}
            </div>
            <div className="admin-header__user-info">
              <strong>{currentUser?.name || 'Administrator'}</strong>
              <span>Store Manager</span>
            </div>
            <button
              type="button"
              className="admin-header__logout"
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
        </header>
        <main className="admin-layout__content">{children}</main>
      </div>
    </div>
  )
}
