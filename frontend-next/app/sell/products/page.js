'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../context/AuthContext'
import {
  deleteSellerProduct,
  listSellerProducts,
} from '../../../lib/clientApi'

function statusLabel(status) {
  if (status === 'approved') return 'Approved'
  if (status === 'rejected') return 'Rejected'
  return 'Pending approval'
}

function statusClass(status) {
  if (status === 'approved') return 'sell-badge sell-badge--ok'
  if (status === 'rejected') return 'sell-badge sell-badge--bad'
  return 'sell-badge sell-badge--pending'
}

export default function SellProductsPage() {
  const { currentUser } = useAuth()
  const canList = currentUser?.seller_active !== false
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const data = await listSellerProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || 'Could not load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async (id) => {
    if (!confirm('Delete this product permanently?')) return
    setDeletingId(id)
    try {
      await deleteSellerProduct(id)
      setProducts((list) => list.filter((p) => p.id !== id))
    } catch (e) {
      setError(e.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="sell-page">
      <header className="sell-page__header sell-page__header--row">
        <div>
          <span className="page-eyebrow">Your catalogue</span>
          <h1>My products</h1>
          <p className="muted">
            New and edited listings stay <strong>pending</strong> until Mercy Gold
            approves them for the shop.
          </p>
        </div>
        {canList ? (
          <Link href="/sell/products/new" className="btn-primary">
            Add product
          </Link>
        ) : (
          <span className="btn-primary is-disabled" aria-disabled>
            Add product
          </span>
        )}
      </header>

      {!canList && (
        <div className="sell-banner sell-banner--warn" role="status">
          Your seller account is inactive — you cannot add new products.
        </div>
      )}

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {loading && <p className="muted">Loading products…</p>}

      {!loading && products.length === 0 && (
        <div className="sell-card">
          <p className="muted">No products yet.</p>
          {canList && (
            <p>
              <Link href="/sell/products/new" className="btn-primary">
                List your first product
              </Link>
            </p>
          )}
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="sell-table-wrap">
          <table className="sell-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
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
                  <td>{p.category || '—'}</td>
                  <td>KSh {Number(p.price).toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={statusClass(p.approval_status)}>
                      {statusLabel(p.approval_status)}
                    </span>
                  </td>
                  <td className="sell-table__actions">
                    <Link href={`/sell/products/${p.id}`}>Edit</Link>
                    <button
                      type="button"
                      className="linkish"
                      disabled={deletingId === p.id}
                      onClick={() => handleDelete(p.id)}
                    >
                      {deletingId === p.id ? '…' : 'Delete'}
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
