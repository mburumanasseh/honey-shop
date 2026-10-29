'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  listAdminFarmers,
  setFarmerSellerActive,
} from '../../../lib/clientApi'

export default function NasFarmersPage() {
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const data = await listAdminFarmers()
      setFarmers(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || 'Could not load farmers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggle = async (f) => {
    setBusyId(f.id)
    try {
      const updated = await setFarmerSellerActive(f.id, !f.seller_active)
      setFarmers((list) =>
        list.map((row) => (row.id === f.id ? { ...row, ...updated } : row)),
      )
    } catch (e) {
      setError(e.message || 'Update failed')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Farmers</h1>
        <p className="muted">
          Deactivating a farmer hides their products from the shop and blocks new
          listings. They can still log in to /sell.
        </p>
      </header>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="muted">Loading…</p>}

      {!loading && farmers.length === 0 && (
        <p className="muted">No farmer accounts yet.</p>
      )}

      {!loading && farmers.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Farmer</th>
                <th>Farm</th>
                <th>County</th>
                <th>Products</th>
                <th>Pending</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {farmers.map((f) => (
                <tr key={f.id}>
                  <td>
                    <strong>{f.name}</strong>
                    <div className="muted">{f.email}</div>
                    {f.phone ? <div className="muted">{f.phone}</div> : null}
                  </td>
                  <td>{f.farm_name || '—'}</td>
                  <td>{f.county || '—'}</td>
                  <td>{f.products_count}</td>
                  <td>{f.pending_count}</td>
                  <td>
                    <span
                      className={
                        f.seller_active
                          ? 'sell-badge sell-badge--ok'
                          : 'sell-badge sell-badge--bad'
                      }
                    >
                      {f.seller_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={busyId === f.id}
                      onClick={() => toggle(f)}
                    >
                      {busyId === f.id
                        ? '…'
                        : f.seller_active
                          ? 'Deactivate'
                          : 'Activate'}
                    </button>
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
