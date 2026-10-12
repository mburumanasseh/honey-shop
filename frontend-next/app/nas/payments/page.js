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
  if (order.payment_method === 'cash') return 'Paid (cash)'
  if (order.payment_method === 'mpesa') return 'Paid (M-Pesa)'
  if (order.payment_method === 'other') return 'Paid (other)'
  if (['paid', 'processing', 'shipped', 'delivered'].includes(order.status))
    return 'Paid'
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
      setOrders((await adminListOrders({ limit: 100 })) || [])
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
    let completed = 0
    let pending = 0
    let failed = 0
    for (const o of orders) {
      const label = paymentLabel(o)
      if (label.startsWith('Paid')) completed += 1
      else if (label === 'Cancelled') failed += 1
      else pending += 1
    }
    return { total: orders.length, completed, pending, failed }
  }, [orders])

  const update = async (id, payload) => {
    setSavingId(id)
    setError('')
    try {
      await adminUpdateOrder(id, payload)
      await load()
    } catch (err) {
      setError(err.message || 'Update failed')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="nas-page">
      <div className="nas-page__header">
        <div>
          <span className="nas-eyebrow">Money</span>
          <h1>Payments</h1>
          <p className="nas-muted">Mark cash payments or set M-Pesa / other.</p>
        </div>
      </div>
      <div className="nas-stats">
        <div className="nas-stat">
          <span>Total</span>
          <strong>{summary.total}</strong>
        </div>
        <div className="nas-stat">
          <span>Completed</span>
          <strong>{summary.completed}</strong>
        </div>
        <div className="nas-stat">
          <span>Pending</span>
          <strong>{summary.pending}</strong>
        </div>
        <div className="nas-stat">
          <span>Cancelled</span>
          <strong>{summary.failed}</strong>
        </div>
      </div>
      {error && <p className="nas-error" role="alert">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="nas-table-wrap">
          <table className="nas-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#ORD-{o.id}</td>
                  <td>{o.shipping_name}</td>
                  <td>KSh {Number(o.total_amount).toLocaleString()}</td>
                  <td>
                    <select
                      value={o.payment_method || ''}
                      disabled={savingId === o.id}
                      onChange={(e) =>
                        update(o.id, {
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
                  <td>
                    {paymentLabel(o)}
                    <div className="nas-muted">{o.status}</div>
                  </td>
                  <td>
                    {o.status === 'pending' && !o.payment_method ? (
                      <button
                        type="button"
                        className="nas-btn nas-btn--green"
                        disabled={savingId === o.id}
                        onClick={() =>
                          update(o.id, {
                            status: 'paid',
                            payment_method: 'cash',
                          })
                        }
                      >
                        Mark paid (cash)
                      </button>
                    ) : (
                      '—'
                    )}
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
