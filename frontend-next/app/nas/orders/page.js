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

  const patch = async (id, payload) => {
    setError('')
    try {
      await adminUpdateOrder(id, payload)
      await load()
    } catch (err) {
      setError(err.message || 'Update failed')
    }
  }

  return (
    <div className="nas-page">
      <div className="nas-page__header">
        <div>
          <span className="nas-eyebrow">Sales</span>
          <h1>Orders</h1>
        </div>
      </div>
      {error && <p className="nas-error" role="alert">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : orders.length === 0 ? (
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
                <th>Payment</th>
                <th>Items</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>
                    <strong>{o.shipping_name}</strong>
                    <div className="nas-muted">{o.shipping_phone}</div>
                  </td>
                  <td>KSh {Number(o.total_amount).toLocaleString()}</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => patch(o.id, { status: e.target.value })}
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
                      value={o.payment_method || ''}
                      onChange={(e) =>
                        patch(o.id, {
                          payment_method: e.target.value || 'none',
                        })
                      }
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m.value || 'none'} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{o.items?.length ?? 0}</td>
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
    </div>
  )
}
