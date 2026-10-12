'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { listProducts, updateProduct } from '../../../lib/clientApi'

export default function NasInventoryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setItems((await listProducts({ includeInactive: true, limit: 100 })) || [])
    } catch (err) {
      setError(err.message || 'Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const lowStock = useMemo(
    () => items.filter((p) => p.is_active && p.stock <= 10).length,
    [items],
  )

  const saveStock = async (product, raw) => {
    const stock = Number(raw)
    if (Number.isNaN(stock) || stock < 0) return
    setSavingId(product.id)
    setError('')
    try {
      const updated = await updateProduct(product.id, { stock })
      setItems((prev) => prev.map((p) => (p.id === product.id ? updated : p)))
    } catch (err) {
      setError(err.message || 'Could not update stock')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="nas-page">
      <div className="nas-page__header">
        <div>
          <span className="nas-eyebrow">Stock</span>
          <h1>Inventory</h1>
          <p className="nas-muted">
            {items.length} products · {lowStock} low stock (≤10)
          </p>
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
                <th>Product</th>
                <th>Size</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    <div className="nas-muted">#{p.id}</div>
                  </td>
                  <td>{p.size || '—'}</td>
                  <td>KSh {Number(p.price).toLocaleString()}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      defaultValue={p.stock}
                      key={`${p.id}-${p.stock}`}
                      disabled={savingId === p.id}
                      onBlur={(e) => {
                        if (Number(e.target.value) !== p.stock) {
                          saveStock(p, e.target.value)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') e.target.blur()
                      }}
                      style={{ width: '5rem' }}
                    />
                  </td>
                  <td>
                    {p.is_active
                      ? p.stock <= 10
                        ? 'Low stock'
                        : 'In stock'
                      : 'Inactive'}
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
