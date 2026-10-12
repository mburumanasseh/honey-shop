'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { href: '/nas', label: 'Dashboard', end: true },
  { href: '/nas/products', label: 'Products' },
  { href: '/nas/orders', label: 'Orders' },
  { href: '/nas/customers', label: 'Customers' },
  { href: '/nas/inventory', label: 'Inventory' },
  { href: '/nas/payments', label: 'Payments' },
  { href: '/nas/settings', label: 'Settings' },
]

function linkActive(pathname, href, end) {
  if (end) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function NasShell({ children }) {
  const pathname = usePathname() || ''
  const { currentUser, logout } = useAuth()

  return (
    <div className="nas-layout">
      <aside className="nas-sidebar">
        <div className="nas-sidebar__brand">
          <Link href="/nas">Mercy Gold</Link>
          <span>Console</span>
        </div>
        <nav className="nas-sidebar__nav" aria-label="Console">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                linkActive(pathname, item.href, item.end)
                  ? 'nas-sidebar__link active'
                  : 'nas-sidebar__link'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nas-sidebar__bottom">
          <p className="nas-sidebar__user">{currentUser?.name || currentUser?.email}</p>
          <button
            type="button"
            className="nas-sidebar__link"
            onClick={() => logout()}
          >
            Sign out
          </button>
          <Link href="/" className="nas-sidebar__link">
            ← Store
          </Link>
        </div>
      </aside>
      <div className="nas-layout__main">
        <main className="nas-layout__content">{children}</main>
      </div>
    </div>
  )
}
