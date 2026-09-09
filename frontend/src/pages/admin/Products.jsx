import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { deleteProduct, listProducts } from '../../services/productService'
import './Products.css'

function Products() {
  const navigate = useNavigate()
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [createdNotice, setCreatedNotice] = useState(
    location.state?.createdId ? `Product #${location.state.createdId} created.` : '',
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listProducts({ includeInactive: true, limit: 100 })
      setProducts(data)
    } catch (err) {
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (product) => {
    if (!window.confirm(`Remove "${product.name}" from the store?`)) return
    setActionError('')
    try {
      await deleteProduct(product.id)
      await load()
    } catch (err) {
      setActionError(err.message || 'Could not delete product')
    }
  }

  return (
    <div className="admin-products">
      <div className="admin-products__header">
        <div>
          <span className="admin-products__eyebrow">Store Management</span>
          <h1>Products</h1>
          <p>Manage your honey products, prices, and inventory.</p>
        </div>
        <button
          type="button"
          className="admin-products__add-button"
          onClick={() => navigate('/admin/products/add')}
        >
          + Add Product
        </button>
      </div>

      <div className="admin-products__toolbar">
        <div className="admin-products__search">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <span className="admin-products__count">
          {loading
            ? 'Loading…'
            : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`}
        </span>
      </div>

      {createdNotice && (
        <p className="admin-products__notice" role="status">
          {createdNotice}
        </p>
      )}

      {(error || actionError) && (
        <p className="admin-products__error" role="alert">
          {error || actionError}
        </p>
      )}

      {loading ? (
        <p>Loading products…</p>
      ) : filteredProducts.length === 0 ? (
        <div className="admin-products__empty">
          <h2>No products found</h2>
          <p>Add a product or try a different search.</p>
        </div>
      ) : (
        <div className="admin-products__table-wrapper">
          <table className="admin-products__table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product">
                      <div className="admin-product__image">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="admin-product__info">
                        <strong>{product.name}</strong>
                        <span>ID: #{product.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>{product.size || '—'}</td>
                  <td>
                    <strong>KSh {Number(product.price).toLocaleString()}</strong>
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    <span className="admin-product__status">
                      {product.is_active
                        ? product.stock > 0
                          ? 'In Stock'
                          : 'Out of stock'
                        : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-product__actions">
                      <button
                        type="button"
                        className="admin-product__delete"
                        onClick={() => handleDelete(product)}
                      >
                        Delete
                      </button>
                    </div>
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

export default Products
