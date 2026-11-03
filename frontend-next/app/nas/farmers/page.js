'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  listAdminFarmers,
  setFarmerSellerActive,
} from '../../../lib/clientApi'

function FarmersContent() {
  const searchParams = useSearchParams()
  const initial =
    searchParams.get('status') === 'verified'
      ? 'verified'
      : searchParams.get('status') === 'all'
        ? 'all'
        : 'pending'

  const [status, setStatus] = useState(initial)
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const data = await listAdminFarmers(status)
      setFarmers(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || 'Could not load farmers')
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    load()
  }, [load])

  const toggle = async (f) => {
    setBusyId(f.id)
    try {
      await setFarmerSellerActive(f.id, !f.seller_active)
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
        <h1>Farmer verification</h1>
        <p className="muted">
          Farmers register first, then appear here as <strong>pending</strong>.
          Contact them to confirm they are legitimate, then{' '}
          <strong>Verify &amp; activate</strong>. Until verified they cannot list
          products.
        </p>
      </header>

      <div className="admin-filters">
        {[
          { id: 'pending', label: 'Pending verification' },
          { id: 'verified', label: 'Verified' },
          { id: 'all', label: 'All farmers' },
        ].map((s) => (
          <button
            key={s.id}
            type="button"
            className={status === s.id ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setStatus(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="muted">Loading…</p>}

      {!loading && farmers.length === 0 && (
        <div className="admin-empty-card">
          <p className="muted">
            {status === 'pending'
              ? 'No farmer verification requests right now. New seller signups at /sell/register will show up here.'
              : 'No farmers in this filter.'}
          </p>
        </div>
      )}

      {!loading && farmers.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Farmer</th>
                <th>Farm</th>
                <th>Location</th>
                <th>Goods to sell</th>
                <th>Products</th>
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
                    {f.mpesa_number ? (
                      <div className="muted">M-Pesa: {f.mpesa_number}</div>
                    ) : null}
                    {f.created_at ? (
                      <div className="muted">
                        Applied: {new Date(f.created_at).toLocaleString()}
                      </div>
                    ) : null}
                  </td>
                  <td>{f.farm_name || '—'}</td>
                  <td>
                    {f.farm_location || '—'}
                    {f.county ? <div className="muted">{f.county}</div> : null}
                  </td>
                  <td className="admin-farmers__goods">
                    {f.goods_to_sell || '—'}
                  </td>
                  <td>
                    {f.products_count}
                    {f.pending_count ? (
                      <div className="muted">{f.pending_count} pending</div>
                    ) : null}
                  </td>
                  <td>
                    <span
                      className={
                        f.seller_active
                          ? 'sell-badge sell-badge--ok'
                          : 'sell-badge sell-badge--pending'
                      }
                    >
                      {f.seller_active ? 'Verified' : 'Pending verification'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={f.seller_active ? 'btn-secondary' : 'btn-primary'}
                      disabled={busyId === f.id}
                      onClick={() => toggle(f)}
                    >
                      {busyId === f.id
                        ? '…'
                        : f.seller_active
                          ? 'Revoke verification'
                          : 'Verify & activate'}
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

export default function NasFarmersPage() {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <FarmersContent />
    </Suspense>
  )
}
