import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminListOrders } from '../../services/orderService'
import './Payments.css'

function paymentLabel(status) {
  if (status === 'paid' || status === 'processing' || status === 'shipped' || status === 'delivered') {
    return 'Completed'
  }
  if (status === 'cancelled') return 'Failed'
  return 'Pending'
}

function Payments() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminListOrders({ limit: 100 })
      setOrders(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const summary = useMemo(() => {
    const total = orders.length
    let completed = 0
    let pending = 0
    let failed = 0
    for (const o of orders) {
      const label = paymentLabel(o.status)
      if (label === 'Completed') completed += 1
      else if (label === 'Failed') failed += 1
      else pending += 1
    }
    return { total, completed, pending, failed }
  }, [orders])

  return (
    <div className="admin-payments">
      <div className="admin-payments__header">
        <div>
          <span className="admin-payments__eyebrow">Store Management</span>
          <h1>Payments</h1>
          <p>
            Order payment status (M-Pesa transactions will appear here when
            connected).
          </p>
        </div>
      </div>

      <div className="admin-payments__summary">
        <div className="admin-payments__card">
          <span>Total</span>
          <strong>{summary.total}</strong>
        </div>
        <div className="admin-payments__card">
          <span>Completed</span>
          <strong>{summary.completed}</strong>
        </div>
        <div className="admin-payments__card">
          <span>Pending</span>
          <strong>{summary.pending}</strong>
        </div>
        <div className="admin-payments__card">
          <span>Failed / cancelled</span>
          <strong>{summary.failed}</strong>
        </div>
      </div>

      {error && <p role="alert">{error}</p>}

      {loading ? (
        <p>Loading…</p>
      ) : orders.length === 0 ? (
        <p>No orders yet — payments will show after checkout.</p>
      ) : (
        <div className="admin-payments__table-wrapper">
          <table className="admin-payments__table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const label = paymentLabel(order.status)
                const statusClass =
                  label === 'Completed'
                    ? 'payment-status payment-status--completed'
                    : label === 'Failed'
                      ? 'payment-status payment-status--failed'
                      : 'payment-status payment-status--pending'
                return (
                  <tr key={order.id}>
                    <td>#ORD-{order.id}</td>
                    <td>{order.shipping_name}</td>
                    <td>KSh {Number(order.total_amount).toLocaleString()}</td>
                    <td>Checkout</td>
                    <td>
                      <span className={statusClass}>{label}</span>
                      <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                        {order.status}
                      </div>
                    </td>
                    <td>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Payments
