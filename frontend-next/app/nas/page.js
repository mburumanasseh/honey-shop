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
        .slice(0, 8),
    [orders],
  )

  return (
    <div className="nas-page">
      <div className="nas-page__header">
        <div>
          <span className="nas-eyebrow">Overview</span>
          <h1>Dashboard</h1>
        </div>
        <button type="button" className="nas-btn" onClick={load} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      {error && <p className="nas-error" role="alert">{error}</p>}
      <div className="nas-stats">
        <div className="nas-stat">
          <span>Online now</span>
          <strong>{presence == null ? '…' : String(presence.online_total ?? 0)}</strong>
        </div>
        <div className="nas-stat">
          <span>Orders</span>
          <strong>{loading ? '…' : stats.orderCount}</strong>
        </div>
        <div className="nas-stat">
          <span>Revenue</span>
          <strong>{loading ? '…' : formatKes(stats.revenue)}</strong>
        </div>
        <div className="nas-stat">
          <span>Products</span>
          <strong>{loading ? '…' : stats.activeProducts}</strong>
        </div>
        <div className="nas-stat">
          <span>Customers</span>
          <strong>{loading ? '…' : stats.customerCount}</strong>
        </div>
      </div>
      <section className="nas-section">
        <div className="nas-section__head">
          <h2>Recent orders</h2>
          <Link href="/nas/orders">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="nas-muted">No orders yet.</p>
        ) : (
          <div className="nas-table-wrap">
            <table className="nas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.shipping_name}</td>
                    <td>KSh {Number(o.total_amount).toLocaleString()}</td>
                    <td>{o.status}</td>
                    <td>
                      {o.created_at
                        ? new Date(o.created_at).toLocaleString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
