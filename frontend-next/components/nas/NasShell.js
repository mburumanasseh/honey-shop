'use client'

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
  { href: '/nas/orders', label: 'Orders', Icon: IconList },
  { href: '/nas/customers', label: 'Customers', Icon: IconUsers },
  { href: '/nas/inventory', label: 'Inventory', Icon: IconLayers },
  { href: '/nas/payments', label: 'Payments', Icon: IconWallet },
]

function linkActive(pathname, href, end) {
  if (end) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function NasShell({ children }) {
  const pathname = usePathname() || ''
  const { currentUser, logout } = useAuth()
  const initial = (currentUser?.name || currentUser?.email || 'A')
    .charAt(0)
    .toUpperCase()

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <Link
            href="/nas"
            className="admin-sidebar__brand-link"
            aria-label="Mercy Gold Honey console"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mercy-gold-logo.jpg"
              alt="Mercy Gold Honey"
              className="admin-sidebar__logo"
            />
          </Link>
          <span className="admin-sidebar__badge">Admin</span>
        </div>

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
            >
              <span className="admin-sidebar__icon">
                <item.Icon size={18} />
              </span>
              {item.label}
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
          >
            <span className="admin-sidebar__icon">
              <IconSettings size={18} />
            </span>
            Settings
          </Link>
          <Link href="/" className="admin-sidebar__link">
            <span className="admin-sidebar__icon">
              <IconArrowLeft size={18} />
            </span>
            Back to Shop
          </Link>
        </div>
      </aside>

      <div className="admin-layout__main">
        <header className="admin-header">
          <div className="admin-header__title">
            <span>Mercy Gold Honey</span>
            <h1>Admin Dashboard</h1>
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
              onClick={() => logout()}
              style={{
                marginLeft: 8,
                border: '1px solid var(--color-border)',
                background: 'transparent',
                borderRadius: 8,
                padding: '8px 12px',
                font: 'inherit',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
              }}
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
