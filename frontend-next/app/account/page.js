'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { listMyOrders } from '../../lib/clientApi'
import {
  IconCart,
  IconChat,
  IconHoney,
  IconPackage,
  IconSearch,
  IconUser,
} from '../../components/Icons'

function formatKes(amount) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

function statusClass(status) {
  const s = (status || 'pending').toLowerCase()
  if (s === 'cancelled') return 'account-status account-status--cancelled'
  if (['paid', 'processing', 'shipped', 'delivered'].includes(s)) {
    return 'account-status account-status--paid'
  }
  return 'account-status account-status--pending'
}

const QUICK_LINKS = [
  {
    href: '/shop',
    Icon: IconHoney,
    title: 'Shop honey',
    desc: 'Browse the collection',
  },
  {
    href: '/orders',
    Icon: IconPackage,
    title: 'My orders',
    desc: 'Full order history',
  },
  {
    href: '/track',
    Icon: IconSearch,
    title: 'Track order',
    desc: 'Find by order # + phone',
  },
  {
    href: '/cart',
    Icon: IconCart,
    title: 'Cart',
    desc: 'Review items to checkout',
  },
  {
    href: '/profile',
    Icon: IconUser,
    title: 'Profile',
    desc: 'Name, email & phone',
  },
  {
    href: '/faq',
    Icon: IconChat,
    title: 'Help & FAQ',
    desc: 'Answers about delivery',
  },
]

export default function AccountDashboardPage() {
  const { currentUser, isAuthenticated, loading, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated) {
      setFetching(false)
      return
    }
    listMyOrders()
      .then((data) => setOrders(data || []))
      .catch((err) => setError(err.message || 'Could not load orders'))
      .finally(() => setFetching(false))
  }, [isAuthenticated, loading])

  const stats = useMemo(() => {
    const active = orders.filter((o) => o.status !== 'cancelled')
    const spent = active.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
    return {
      count: orders.length,
      spent,
      lastStatus: orders[0]?.status || null,
    }
  }, [orders])

  const recent = useMemo(() => orders.slice(0, 5), [orders])

  if (loading || (isAuthenticated && fetching)) {
    return (
      <div className="account-page">
        <p className="muted">Loading your account…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="account-gate">
        <span className="account-hero__eyebrow">Account</span>
        <h1>Sign in to continue</h1>
        <p>
          Your dashboard shows orders, shortcuts, and profile details. Guest
          checkout still works without an account.
        </p>
        <div className="account-hero__actions" style={{ justifyContent: 'center' }}>
          <Link href="/login?next=/account" className="btn-secondary">
            Log in
          </Link>
          <Link href="/register?next=/account" className="btn-ghost">
            Create account
          </Link>
        </div>
      </div>
    )
  }

  const firstName =
    (currentUser?.name || '').trim().split(/\s+/)[0] || 'there'

  return (
    <div className="account-page">
      <header className="account-hero">
        <div>
          <span className="account-hero__eyebrow">Your account</span>
          <h1>Welcome back, {firstName}</h1>
          <p>
            Manage orders, keep shopping, or update your details — all in one
            place.
          </p>
        </div>
        <div className="account-hero__actions">
          <Link href="/shop" className="btn-secondary">
            Continue shopping
          </Link>
          <button type="button" className="btn-ghost" onClick={() => logout()}>
            Log out
          </button>
        </div>
      </header>

      <nav className="account-nav" aria-label="Account">
        <Link href="/account" className="active">
          Dashboard
        </Link>
        <Link href="/orders">Orders</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/track">Track</Link>
      </nav>

      <div className="account-stats">
        <div className="account-stat">
          <span>Orders</span>
          <strong>{stats.count}</strong>
          <p>{stats.count === 0 ? 'None yet' : 'In your history'}</p>
        </div>
        <div className="account-stat">
          <span>Total spent</span>
          <strong>{formatKes(stats.spent)}</strong>
          <p>Excluding cancelled</p>
        </div>
        <div className="account-stat">
          <span>Latest status</span>
          <strong style={{ fontSize: '1.15rem', textTransform: 'capitalize' }}>
            {stats.lastStatus || '—'}
          </strong>
          <p>{stats.lastStatus ? 'Most recent order' : 'Place an order to begin'}</p>
        </div>
      </div>

      <section className="account-section">
        <div className="account-section__header">
          <h2>Quick links</h2>
        </div>
        <div className="account-actions">
          {QUICK_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="account-action">
              <span className="account-action__icon" aria-hidden>
                <item.Icon size={18} />
              </span>
              <strong>{item.title}</strong>
              <span>{item.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="account-section">
        <div className="account-section__header">
          <h2>Recent orders</h2>
          <Link href="/orders">View all</Link>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {recent.length === 0 ? (
          <div className="account-empty">
            <p>No orders linked to this account yet.</p>
            <p>
              <Link href="/shop">Browse the shop</Link> or{' '}
              <Link href="/track">track a guest order</Link>.
            </p>
          </div>
        ) : (
          <div className="account-orders">
            {recent.map((order) => (
              <article key={order.id} className="account-order">
                <div className="account-order__meta">
                  <strong>#ORD-{order.id}</strong>
                  <span>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString()
                      : '—'}
                    {order.items?.length
                      ? ` · ${order.items.length} item${order.items.length === 1 ? '' : 's'}`
                      : ''}
                  </span>
                </div>
                <span className="account-order__amount">
                  {formatKes(order.total_amount)}
                </span>
                <span className={statusClass(order.status)}>{order.status}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
