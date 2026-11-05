'use client'

import { useCallback, useEffect, useState } from 'react'
import { adminListOrders, adminUpdateOrder } from '../../../lib/clientApi'

const STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_METHODS = [
  { value: '', label: 'Not set' },
  { value: 'cash', label: 'Cash' },
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'other', label: 'Other' },
]

export default function NasOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setOrders((await adminListOrders({ limit: 100 })) || [])
    } catch (err) {
      setError(err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleStatus = async (orderId, status) => {
    setError('')
    try {
      await adminUpdateOrder(orderId, { status })
      await load()
    } catch (err) {
      setError(err.message || 'Could not update status')
    }
  }

  const handlePaymentMethod = async (orderId, method) => {
    setError('')
    try {
      await adminUpdateOrder(orderId, { payment_method: method || 'none' })
      await load()
    } catch (err) {
      setError(err.message || 'Could not update payment method')
    }
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders__header">
        <span className="admin-orders__eyebrow">Sales</span>
        <h1>Orders</h1>
        <p>View and update customer orders.</p>
      </div>

      {error && (
        <p role="alert" className="admin-orders__error">
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="admin-orders__empty">
          <h2>No orders yet</h2>
          <p>Orders will appear here after customers checkout.</p>
        </div>
      ) : (
        <div className="admin-orders__table-wrapper">
          <table className="admin-orders__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Items</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <div>
                      <strong>{order.shipping_name}</strong>
                      <div>{order.shipping_phone}</div>
                    </div>
                  </td>
                  <td>KSh {Number(order.total_amount).toLocaleString()}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatus(order.id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={order.payment_method || ''}
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
                  <td>{order.items?.length ?? 0}</td>
                  <td>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
