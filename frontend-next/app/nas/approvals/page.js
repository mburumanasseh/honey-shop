'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  listAdminFarmers,
  listProductApprovals,
  setFarmerSellerActive,
  setProductApproval,
} from '../../../lib/clientApi'

export default function NasApprovalsPage() {
  const [tab, setTab] = useState('farmers')
  const [farmers, setFarmers] = useState([])
  const [products, setProducts] = useState([])
  const [productStatus, setProductStatus] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const loadFarmers = useCallback(async () => {
    const data = await listAdminFarmers('pending')
    setFarmers(Array.isArray(data) ? data : [])
  }, [])

  const loadProducts = useCallback(async () => {
    const data = await listProductApprovals(productStatus)
    setProducts(Array.isArray(data) ? data : [])
  }, [productStatus])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setError('')
      setLoading(true)
      try {
        if (tab === 'farmers') await loadFarmers()
        else await loadProducts()
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [tab, loadFarmers, loadProducts])

  const verifyFarmer = async (f) => {
    setBusyId(`f-${f.id}`)
    try {
      await setFarmerSellerActive(f.id, true)
      await loadFarmers()
    } catch (e) {
      setError(e.message || 'Could not verify farmer')
    } finally {
      setBusyId(null)
    }
  }

  const decideProduct = async (id, approval_status) => {
    setBusyId(`p-${id}`)
    try {
      await setProductApproval(id, approval_status)
      await loadProducts()
    } catch (e) {
      setError(e.message || 'Update failed')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Approvals</h1>
        <p className="muted">
          Farmer accounts register first, then wait here for verification. Product
          listings from verified farmers also need approval before they appear in
          the shop.
        </p>
      </header>

      <div className="admin-filters">
        <button
          type="button"
          className={tab === 'farmers' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setTab('farmers')}
        >
          Farmer verifications
        </button>
        <button
          type="button"
          className={tab === 'products' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setTab('products')}
        >
          Product listings
        </button>
        <Link href="/nas/farmers?status=all" className="btn-secondary">
          All farmers →
        </Link>
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="muted">Loading…</p>}

      {!loading && tab === 'farmers' && (
        <>
          {farmers.length === 0 ? (
            <div className="admin-empty-card">
              <p>
                <strong>No pending farmer verification requests</strong>
              </p>
              <p className="muted">
                When someone completes /sell/register, they appear here until you
                verify them.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Location</th>
                    <th>Goods</th>
                    <th>Applied</th>
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
                        {f.farm_name ? (
                          <div className="muted">Farm: {f.farm_name}</div>
                        ) : null}
                      </td>
                      <td>
                        {f.farm_location || '—'}
                        {f.county ? (
                          <div className="muted">{f.county}</div>
                        ) : null}
                      </td>
                      <td className="admin-farmers__goods">
                        {f.goods_to_sell || '—'}
                      </td>
                      <td>
                        {f.created_at
                          ? new Date(f.created_at).toLocaleString()
                          : '—'}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-primary"
                          disabled={busyId === `f-${f.id}`}
                          onClick={() => verifyFarmer(f)}
                        >
                          {busyId === `f-${f.id}` ? '…' : 'Verify & activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!loading && tab === 'products' && (
        <>
          <div className="admin-filters">
            {['pending', 'approved', 'rejected', 'all'].map((s) => (
              <button
                key={s}
                type="button"
                className={productStatus === s ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setProductStatus(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          {products.length === 0 ? (
            <p className="muted">No products in this filter.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Seller</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.name}</strong>
                        {p.size ? (
                          <span className="muted"> · {p.size}</span>
                        ) : null}
                      </td>
                      <td>
                        {p.farm_name || p.seller_name || '—'}
                        {p.seller_email ? (
                          <div className="muted">{p.seller_email}</div>
                        ) : null}
                      </td>
                      <td>{p.category}</td>
                      <td>KSh {Number(p.price).toLocaleString()}</td>
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
                            disabled={busyId === `p-${p.id}`}
                            onClick={() => decideProduct(p.id, 'approved')}
                          >
                            Approve
                          </button>
                        )}
                        {p.approval_status !== 'rejected' && (
                          <button
                            type="button"
                            className="btn-secondary"
                            disabled={busyId === `p-${p.id}`}
                            onClick={() => decideProduct(p.id, 'rejected')}
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
        </>
      )}
    </div>
  )
}
