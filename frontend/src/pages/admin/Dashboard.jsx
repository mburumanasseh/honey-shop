import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/admin/StatCard'
import { listCustomers } from '../../services/adminService'
import { adminListOrders } from '../../services/orderService'
import { listProducts } from '../../services/productService'
import './Admin.css'

function formatKes(amount) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

function statusClass(status) {
  const s = (status || '').toLowerCase()
  if (s === 'paid' || s === 'delivered' || s === 'shipped' || s === 'processing') {
    return 'order-status order-status--paid'
  }
  if (s === 'cancelled') {
    return 'order-status order-status--cancelled'
  }
  return 'order-status order-status--pending'
}

function Dashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [ordersData, productsData, customersData] = await Promise.all([
        adminListOrders({ limit: 100 }),
        listProducts({ includeInactive: true, limit: 100 }),
        listCustomers({ limit: 200 }),
      ])
      setOrders(ordersData || [])
      setProducts(productsData || [])
      setCustomers(customersData || [])
    } catch (err) {
      setError(err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const stats = useMemo(() => {
    const orderCount = orders.length
    const revenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
    const activeProducts = products.filter((p) => p.is_active).length
    const customerCount = customers.filter((c) => !c.is_admin).length
    return { orderCount, revenue, activeProducts, customerCount }
  }, [orders, products, customers])

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 5)
  }, [orders])

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

      <section className="admin-dashboard__section">
        <div className="admin-dashboard__section-header">
          <div>
            <span>Latest activity</span>
            <h2>Recent orders</h2>
          </div>
          <Link to="/admin/orders">View all</Link>
        </div>

        {loading ? (
          <p>Loading orders…</p>
        ) : recentOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="admin-dashboard__orders">
            {recentOrders.map((order) => (
              <div className="admin-dashboard__order" key={order.id}>
                <div>
                  <strong>#ORD-{order.id}</strong>
                  <span>{order.shipping_name}</span>
                </div>
                <strong>{formatKes(order.total_amount)}</strong>
                <span className={statusClass(order.status)}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard
