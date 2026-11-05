import { useCallback, useEffect, useMemo, useState } from 'react'
import { listProducts, updateProduct } from '../../services/productService'
import './Inventory.css'

function Inventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listProducts({ includeInactive: true, limit: 100 })
      setItems(data || [])
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

  const handleStockChange = async (product, raw) => {
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
    <div className="inventory-page">
      <div className="inventory-header">
        <div>
          <h1>Inventory</h1>
          <p>Stock levels for all products.</p>
        </div>
        <div className="inventory-summary">
          <span>{items.length} products</span>
          <span>{lowStock} low stock (≤10)</span>
        </div>
      </div>

      {error && <p role="alert">{error}</p>}

      {loading ? (
        <p>Loading inventory…</p>
      ) : items.length === 0 ? (
        <p>No products yet. Add products first.</p>
      ) : (
        <div className="inventory-table-wrapper">
          <table className="inventory-table">
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
              {items.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <div>#{product.id}</div>
                  </td>
                  <td>{product.size || '—'}</td>
                  <td>KSh {Number(product.price).toLocaleString()}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      defaultValue={product.stock}
                      key={`${product.id}-${product.stock}`}
                      disabled={savingId === product.id}
                      onBlur={(e) => {
                        if (Number(e.target.value) !== product.stock) {
                          handleStockChange(product, e.target.value)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.target.blur()
                        }
                      }}
                      style={{ width: '5rem' }}
                    />
                    {savingId === product.id && <span> saving…</span>}
                  </td>
                  <td>
                    {product.is_active
                      ? product.stock <= 10
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

export default Inventory
