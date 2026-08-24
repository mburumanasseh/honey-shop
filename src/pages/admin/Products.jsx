import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import products from '../../data'
import './Products.css'

function Products() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    navigate('/admin/products/add')
  }

  return (
    <div className="admin-products">
      <div className="admin-products__header">
        <div>
          <span className="admin-products__eyebrow">
            Store Management
          </span>

          <h1>Products</h1>

          <p>
            Manage your honey products, prices, and inventory.
          </p>
        </div>

        <button
          type="button"
          className="admin-products__add-button"
          onClick={handleAddProduct}
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
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <span className="admin-products__count">
          {filteredProducts.length}{' '}
          {filteredProducts.length === 1
            ? 'product'
            : 'products'}
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="admin-products__empty">
          <h2>No products found</h2>

          <p>
            Try searching with a different product name.
          </p>
        </div>
      ) : (
        <div className="admin-products__table-wrapper">
          <table className="admin-products__table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Price</th>
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
                        <img
                          src={product.image}
                          alt={product.name}
                        />
                      </div>

                      <div className="admin-product__info">
                        <strong>{product.name}</strong>

                        <span>
                          ID: #{product.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>{product.size}</td>

                  <td>
                    <strong>
                      KSh {product.price.toLocaleString()}
                    </strong>
                  </td>

                  <td>
                    <span className="admin-product__status">
                      In Stock
                    </span>
                  </td>

                  <td>
                    <div className="admin-product__actions">
                      <button
                        type="button"
                        className="admin-product__edit"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="admin-product__delete"
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