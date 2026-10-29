'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import BrandLockup from '../BrandLockup'

const NAV = [
  { href: '/sell', label: 'Dashboard', exact: true },
  { href: '/sell/products', label: 'My products' },
  { href: '/sell/orders', label: 'Orders' },
  { href: '/sell/profile', label: 'Profile' },
]

export default function SellShell({ children }) {
  const pathname = usePathname() || ''
  const { currentUser, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/sell/login')
  }

  const sellerInactive =
    currentUser?.role === 'farmer' && currentUser?.seller_active === false

  return (
    <div className="sell-shell">
      <aside className="sell-sidebar">
        <div className="sell-sidebar__brand">
          <BrandLockup className="sell-sidebar__logo" />
          <span className="sell-sidebar__badge">Seller</span>
        </div>
        <nav className="sell-sidebar__nav" aria-label="Seller">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? 'is-active' : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="sell-sidebar__foot">
          <p className="sell-sidebar__user">
            {currentUser?.farm_name || currentUser?.name}
          </p>
          <button type="button" className="sell-sidebar__logout" onClick={handleLogout}>
            Log out
          </button>
          <Link href="/" className="sell-sidebar__store">
            ← Back to store
          </Link>
        </div>
      </aside>
      <div className="sell-main">
        {sellerInactive && (
          <div className="sell-banner sell-banner--warn" role="status">
            Your seller account is <strong>pending verification</strong> or has
            been deactivated. You can log in, but you cannot list products until
            Mercy Gold verifies your account after contacting you.
          </div>
        )}
        <div className="sell-main__inner">{children}</div>
      </div>
    </div>
  )
}
