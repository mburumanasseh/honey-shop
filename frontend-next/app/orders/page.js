'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { listMyOrders } from '../../lib/clientApi'

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

export default function OrdersPage() {
  const { isAuthenticated, loading, logout } = useAuth()
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

  if (loading || (isAuthenticated && fetching)) {
    return (
      <div className="account-page">
        <p className="muted">Loading orders…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="account-gate">
        <span className="account-hero__eyebrow">Orders</span>
        <h1>Sign in to see your orders</h1>
        <p>
          Orders placed while logged in appear here. Guest orders can be found
          on Track with order number and phone.
        </p>
        <div className="account-hero__actions" style={{ justifyContent: 'center' }}>
          <Link href="/login?next=/orders" className="btn-secondary">
            Log in
          </Link>
          <Link href="/track" className="btn-ghost">
            Track guest order
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="account-page">
      <header className="account-hero">
        <div>
          <span className="account-hero__eyebrow">Orders</span>
          <h1>Order history</h1>
          <p>Every order placed while signed in to this account.</p>
        </div>
        <div className="account-hero__actions">
          <Link href="/account" className="btn-ghost">
            Dashboard
          </Link>
          <Link href="/shop" className="btn-secondary">
            Shop again
          </Link>
        </div>
      </header>

      <nav className="account-nav" aria-label="Account">
        <Link href="/account">Dashboard</Link>
        <Link href="/orders" className="active">
          Orders
        </Link>
        <Link href="/profile">Profile</Link>
        <Link href="/track">Track</Link>
      </nav>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {orders.length === 0 ? (
        <div className="account-empty">
          <p>No orders yet.</p>
          <p>
            <Link href="/shop">Start shopping</Link> ·{' '}
            <Link href="/track">Track a guest order</Link>
          </p>
        </div>
      ) : (
        <div className="account-orders">
          {orders.map((order) => (
            <article key={order.id} className="account-order">
              <div className="account-order__meta">
                <strong>#ORD-{order.id}</strong>
                <span>
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString()
                    : '—'}
                  {order.shipping_address ? ` · ${order.shipping_address}` : ''}
                </span>
                {order.items?.length > 0 && (
                  <span>
                    {order.items
                      .map(
                        (item) =>
                          `${item.product_name || 'Item'} × ${item.quantity}`,
                      )
                      .join(', ')}
                  </span>
                )}
              </div>
              <span className="account-order__amount">
                {formatKes(order.total_amount)}
              </span>
              <span className={statusClass(order.status)}>{order.status}</span>
            </article>
          ))}
        </div>
      )}

      <p className="muted" style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
        <button
          type="button"
          className="linkish"
          onClick={() => logout()}
          style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer' }}
        >
          Log out
        </button>
      </p>
    </div>
  )
}
