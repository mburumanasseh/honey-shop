'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminListOrders, adminUpdateOrder } from '../../../lib/clientApi'

const PAYMENT_METHODS = [
  { value: '', label: 'Not set' },
  { value: 'cash', label: 'Cash' },
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'other', label: 'Other' },
]

function paymentLabel(order) {
  if (order.payment_method) {
    return order.payment_method === 'cash'
      ? 'Paid (cash)'
      : order.payment_method === 'mpesa'
        ? 'Paid (M-Pesa)'
        : 'Paid (other)'
  }
  if (
    order.status === 'paid' ||
    order.status === 'processing' ||
    order.status === 'shipped' ||
    order.status === 'delivered'
  ) {
    return 'Paid'
  }
  if (order.status === 'cancelled') return 'Cancelled'
  return 'Pending'
}

export default function NasPaymentsPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)

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

  const handlePaymentMethod = async (orderId, method) => {
    setError('')
    setSavingId(orderId)
    try {
      await adminUpdateOrder(orderId, {
        payment_method: method || 'none',
      })
      await load()
    } catch (err) {
      setError(err.message || 'Could not update payment')
    } finally {
      setSavingId(null)
    }
  }

  const handleMarkPaidCash = async (orderId) => {
    setError('')
    setSavingId(orderId)
    try {
      await adminUpdateOrder(orderId, {
        status: 'paid',
        payment_method: 'cash',
      })
      await load()
    } catch (err) {
      setError(err.message || 'Could not mark as paid (cash)')
    } finally {
      setSavingId(null)
    }
  }

  const summary = useMemo(() => {
    const total = orders.length
    let completed = 0
    let pending = 0
    let failed = 0
    for (const o of orders) {
      const label = paymentLabel(o)
      if (label.startsWith('Paid')) completed += 1
      else if (label === 'Cancelled') failed += 1
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
            Mark orders as paid when cash is received, or set M-Pesa / other.
            You can change payment method anytime from this page.
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
                <th>Actions</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const label = paymentLabel(order)
                const statusClass =
                  label.startsWith('Paid')
                    ? 'payment-status payment-status--completed'
                    : label === 'Cancelled'
                      ? 'payment-status payment-status--failed'
                      : 'payment-status payment-status--pending'
                const busy = savingId === order.id
                return (
                  <tr key={order.id}>
                    <td>#ORD-{order.id}</td>
                    <td>{order.shipping_name}</td>
                    <td>KSh {Number(order.total_amount).toLocaleString()}</td>
                    <td>
                      <select
                        value={order.payment_method || ''}
                        disabled={busy}
                        onChange={(e) =>
                          handlePaymentMethod(order.id, e.target.value)
                        }
                        aria-label={`Payment method for order ${order.id}`}
                      >
                        {PAYMENT_METHODS.map((m) => (
                          <option key={m.value || 'none'} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className={statusClass}>{label}</span>
                      <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                        {order.status}
                      </div>
                    </td>
                    <td>
                      {order.status === 'pending' && !order.payment_method ? (
                        <button
                          type="button"
                          className="admin-payments__cash-btn"
                          disabled={busy}
                          onClick={() => handleMarkPaidCash(order.id)}
                        >
                          {busy ? 'Saving…' : 'Mark paid (cash)'}
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>—</span>
                      )}
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
