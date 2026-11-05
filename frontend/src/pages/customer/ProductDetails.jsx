import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../../context/useCart'
import { getProduct } from '../../services/productService'
import './ProductDetails.css'

function ProductDetails() {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { addToCart } = useCart()

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await getProduct(id)
        if (!cancelled) {
          setProduct(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Product not found')
          setProduct(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <main className="product-details">
        <div className="container">
          <p>Loading product…</p>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="product-details">
        <div className="container product-details__not-found">
          <h1>Product not found</h1>
          <p>{error || "The honey product you're looking for doesn't exist."}</p>
          <Link to="/shop">Back to Shop</Link>
        </div>
      </main>
    )
  }

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))
  }

  const increaseQuantity = () => {
    setQuantity((currentQuantity) => {
      const max = product.stock > 0 ? product.stock : currentQuantity + 1
      return Math.min(max, currentQuantity + 1)
    })
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main className="product-details">
      <div className="container">
        <Link to="/shop" className="product-details__back">
          ← Back to Shop
        </Link>

        <div className="product-details__content">
          <div className="product-details__image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-details__info">
            <span className="product-details__size">{product.size}</span>
            <h1>{product.name}</h1>
            <p className="product-details__price">
              KSh {Number(product.price).toLocaleString()}
            </p>
            <p className="product-details__description">{product.description}</p>

            <div className="product-details__quantity">
              <label htmlFor="quantity">Quantity</label>
              <div className="quantity-control">
                <button type="button" onClick={decreaseQuantity} aria-label="Decrease quantity">
                  −
                </button>
                <span id="quantity">{quantity}</span>
                <button type="button" onClick={increaseQuantity} aria-label="Increase quantity">
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              className="product-details__cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0
                ? 'Out of stock'
                : added
                  ? '✓ Added to Cart'
                  : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProductDetails
