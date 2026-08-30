import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { listProducts } from '../../services/productService'
import './FeaturedHoney.css'

function FeaturedHoney() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await listProducts()
        if (!cancelled) {
          setProducts(data.slice(0, 6))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load products')
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
  }, [])

  return (
    <section id="featured" className="featured-honey">
      <div className="container">
        <div className="featured-honey__header">
          <span>Our Selection</span>
          <h2>Featured Honey</h2>
          <p>
            Discover some of our finest honey, carefully selected for quality
            and natural flavor.
          </p>
        </div>

        {error && <p role="alert">{error}</p>}
        {loading ? (
          <p>Loading products…</p>
        ) : (
          <div className="featured-honey__grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedHoney
