'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { deleteProduct, listProducts } from '../../../lib/clientApi'

export default function NasProductsPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setProducts(await listProducts({ includeInactive: true, limit: 100 }))
    } catch (err) {
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = async (product) => {
    if (
      !window.confirm(
        `Permanently delete "${product.name}"?\n\nThis cannot be undone.`,
      )
    )
      return
    setError('')
    try {
      await deleteProduct(product.id)
      await load()
    } catch (err) {
      setError(err.message || 'Could not delete')
    }
  }

  return (
    <div className="nas-page">
      <div className="nas-page__header">
        <div>
          <span className="nas-eyebrow">Catalog</span>
          <h1>Products</h1>
        </div>
        <Link href="/nas/products/new" className="nas-btn">
          + Add product
        </Link>
      </div>
      <div className="nas-toolbar">
        <input
          type="search"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="nas-muted">
          {loading ? 'Loading…' : `${filtered.length} products`}
        </span>
      </div>
      {error && <p className="nas-error" role="alert">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="nas-muted">No products found.</p>
      ) : (
        <div className="nas-table-wrap">
          <table className="nas-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="nas-product-cell">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image || '/honeyjar.jpg'} alt="" />
                      <div>
                        <strong>{p.name}</strong>
                        <span className="nas-muted">#{p.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>{p.size || '—'}</td>
                  <td>KSh {Number(p.price).toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>
                    {p.is_active
                      ? p.stock > 0
                        ? 'In stock'
                        : 'Out of stock'
                      : 'Inactive'}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="nas-btn-danger"
                      onClick={() => handleDelete(p)}
                    >
                      Delete
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
