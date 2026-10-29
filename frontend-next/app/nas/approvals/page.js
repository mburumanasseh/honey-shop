'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  listProductApprovals,
  setProductApproval,
} from '../../../lib/clientApi'

export default function NasApprovalsPage() {
  const [status, setStatus] = useState('pending')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const data = await listProductApprovals(status)
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || 'Could not load products')
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    load()
  }, [load])

  const decide = async (id, approval_status) => {
    setBusyId(id)
    try {
      await setProductApproval(id, approval_status)
      await load()
    } catch (e) {
      setError(e.message || 'Update failed')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Product approvals</h1>
        <p className="muted">
          Farmer listings stay hidden until you approve them.
        </p>
      </header>

      <div className="admin-filters">
        {['pending', 'approved', 'rejected', 'all'].map((s) => (
          <button
            key={s}
            type="button"
            className={status === s ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setStatus(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="muted">Loading…</p>}

      {!loading && items.length === 0 && (
        <p className="muted">No products in this filter.</p>
      )}

      {!loading && items.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Seller</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    {p.size ? <span className="muted"> · {p.size}</span> : null}
                  </td>
                  <td>
                    {p.farm_name || p.seller_name || '—'}
                    {p.seller_email ? (
                      <div className="muted">{p.seller_email}</div>
                    ) : null}
                  </td>
                  <td>{p.category}</td>
                  <td>KSh {Number(p.price).toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span
                      className={
                        p.approval_status === 'approved'
                          ? 'sell-badge sell-badge--ok'
                          : p.approval_status === 'rejected'
                            ? 'sell-badge sell-badge--bad'
                            : 'sell-badge sell-badge--pending'
                      }
                    >
                      {p.approval_status}
                    </span>
                  </td>
                  <td className="admin-table__actions">
                    {p.approval_status !== 'approved' && (
                      <button
                        type="button"
                        className="btn-primary"
                        disabled={busyId === p.id}
                        onClick={() => decide(p.id, 'approved')}
                      >
                        Approve
                      </button>
                    )}
                    {p.approval_status !== 'rejected' && (
                      <button
                        type="button"
                        className="btn-secondary"
                        disabled={busyId === p.id}
                        onClick={() => decide(p.id, 'rejected')}
                      >
                        Reject
                      </button>
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
