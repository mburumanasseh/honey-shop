import { Link } from 'react-router-dom'
import { useCart } from '../../context/useCart'
import './ProductCard.css'

function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <article className="product-card">
      <Link
        to={`/product/${product.id}`}
        className="product-card__image"
      >
        <img
          src={product.image || product.image_url || ""}
          alt={product.name}
        />
      </Link>

      <div className="product-card__content">
        <span className="product-card__size">
          {product.size}
        </span>

        <h3>
          <Link to={`/product/${product.id}`}>
            {product.name}
          </Link>
        </h3>

        <p>{product.description}</p>

        <div className="product-card__footer">
          <span className="product-card__price">
            KSh {Number(product.price).toLocaleString()}
          </span>

          <button
            type="button"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard