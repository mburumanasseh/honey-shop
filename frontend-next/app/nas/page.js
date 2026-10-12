'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  adminListOrders,
  getAdminPresence,
  listCustomers,
  listProducts,
} from '../../lib/clientApi'

function formatKes(amount) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

function statusClass(status) {
  const s = (status || '').toLowerCase()
  if (['paid', 'delivered', 'shipped', 'processing'].includes(s)) {
    return 'order-status order-status--paid'
  }
  if (s === 'cancelled') return 'order-status order-status--cancelled'
  return 'order-status order-status--pending'
}

function StatCard({ title, value, description, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__icon">{icon}</span>
        <span className="stat-card__title">{title}</span>
      </div>
      <strong className="stat-card__value">{value}</strong>
      <p className="stat-card__description">{description}</p>
    </article>
  )
}

export default function NasDashboardPage() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [presence, setPresence] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [ordersData, productsData, customersData, presenceData] =
        await Promise.all([
          adminListOrders({ limit: 100 }),
          listProducts({ includeInactive: true, limit: 100 }),
          listCustomers({ limit: 200 }),
          getAdminPresence().catch(() => null),
        ])
      setOrders(ordersData || [])
      setProducts(productsData || [])
      setCustomers(customersData || [])
      setPresence(presenceData)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    let cancelled = false
    const id = setInterval(async () => {
      try {
        const data = await getAdminPresence()
        if (!cancelled) setPresence(data)
      } catch {
        /* ignore */
      }
    }, 15_000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  const stats = useMemo(() => {
    const orderCount = orders.length
    const revenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
    const activeProducts = products.filter((p) => p.is_active).length
    const customerCount = customers.filter((c) => !c.is_admin).length
    return { orderCount, revenue, activeProducts, customerCount }
  }, [orders, products, customers])

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .slice(0, 5),
    [orders],
  )

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__intro">
        <div>
          <span>Overview</span>
          <h2>Welcome back</h2>
          <p>Here is what is happening with Mercy Gold Honey.</p>
        </div>
        <button type="button" onClick={load} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {error && (
        <p role="alert" className="admin-dashboard__error">
          {error}
        </p>
      )}

      <div className="admin-dashboard__stats">
        <StatCard
          title="Online now"
          value={presence == null ? '…' : String(presence.online_total ?? 0)}
          description={
            presence
              ? `${presence.online_logged_in || 0} logged in · ${presence.online_guests || 0} guests (last ${presence.ttl_seconds || 90}s)`
              : 'People currently on the site'
          }
          icon="●"
        />
        <StatCard
          title="Orders"
          value={loading ? '…' : String(stats.orderCount)}
          description="Orders received"
          icon="▤"
        />
        <StatCard
          title="Revenue"
          value={loading ? '…' : formatKes(stats.revenue)}
          description="Total sales (excl. cancelled)"
          icon="KSh"
        />
        <StatCard
          title="Products"
          value={loading ? '…' : String(stats.activeProducts)}
          description="Active products"
          icon="🍯"
        />
        <StatCard
          title="Customers"
          value={loading ? '…' : String(stats.customerCount)}
          description="Registered customers"
          icon="♙"
        />
      </div>

      {presence?.recent?.length > 0 && (
        <section className="admin-dashboard__section" style={{ marginBottom: 24 }}>
          <div className="admin-dashboard__section-header">
            <div>
              <span>Live</span>
              <h2>Recent activity on site</h2>
            </div>
          </div>
          <div className="admin-dashboard__presence">
            <table className="admin-dashboard__presence-table">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>User</th>
                  <th>Page</th>
                  <th>Last seen</th>
                </tr>
              </thead>
              <tbody>
                {presence.recent.map((row, idx) => (
                  <tr key={`${row.visitor_id}-${idx}`}>
                    <td>{row.visitor_id}</td>
                    <td>
                      {row.user_id != null ? `User #${row.user_id}` : 'Guest'}
                    </td>
                    <td>{row.path || '—'}</td>
                    <td>{row.seconds_ago}s ago</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="admin-dashboard__section">
        <div className="admin-dashboard__section-header">
          <div>
            <span>Latest activity</span>
            <h2>Recent orders</h2>
          </div>
          <Link href="/nas/orders">View all</Link>
        </div>
        {loading ? (
          <p>Loading orders…</p>
        ) : recentOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="admin-dashboard__orders">
            {recentOrders.map((order) => (
              <div key={order.id} className="admin-dashboard__order">
                <div>
                  <strong>#ORD-{order.id}</strong>
                  <span>{order.shipping_name}</span>
                </div>
                <strong>{formatKes(order.total_amount)}</strong>
                <span className={statusClass(order.status)}>{order.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
