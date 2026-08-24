import { useState } from 'react'
import { useCart } from '../../context/useCart'
import { Link, useParams } from 'react-router-dom'
import products from '../../data'
import './ProductDetails.css'

function ProductDetails() {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const { addToCart } = useCart()

  const product = products.find(
    (item) => item.id === Number(id),
  )

  if (!product) {
    return (
      <main className="product-details">
        <div className="container product-details__not-found">
          <h1>Product not found</h1>

          <p>
            The honey product you're looking for doesn't
            exist.
          </p>

          <Link to="/shop">
            Back to Shop
          </Link>
        </div>
      </main>
    )
  }

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) =>
      Math.max(1, currentQuantity - 1),
    )
  }

  const increaseQuantity = () => {
    setQuantity((currentQuantity) =>
      currentQuantity + 1,
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)

    setAdded(true)

    setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  return (
    <main className="product-details">
      <div className="container">
        <Link
          to="/shop"
          className="product-details__back"
        >
          ← Back to Shop
        </Link>

        <div className="product-details__content">
          <div className="product-details__image">
            <img
              src={product.image}
              alt={product.name}
            />
          </div>

          <div className="product-details__info">
            <span className="product-details__size">
              {product.size}
            </span>

            <h1>{product.name}</h1>

            <p className="product-details__price">
              KSh {product.price.toLocaleString()}
            </p>

            <p className="product-details__description">
              {product.description}
            </p>

            <div className="product-details__quantity">
              <label htmlFor="quantity">
                Quantity
              </label>

              <div className="quantity-control">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span id="quantity">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              className="product-details__cart"
              onClick={handleAddToCart}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProductDetails