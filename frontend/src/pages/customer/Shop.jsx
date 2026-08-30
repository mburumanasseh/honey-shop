import { useEffect, useState } from 'react'
import ProductCard from '../../components/products/ProductCard'
import { listProducts } from '../../services/productService'
import './Shop.css'

function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await listProducts()
        if (!cancelled) {
          setProducts(data)
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
    <main className="shop-page">
      <section className="shop-page__header">
        <div className="container">
          <span className="shop-page__eyebrow">Our Collection</span>
          <h1>Shop Our Honey</h1>
          <p>
            Explore our selection of naturally harvested honey, carefully
            sourced and prepared for you.
          </p>
        </div>
      </section>

      <section className="shop-page__products">
        <div className="container">
          <div className="shop-page__top">
            <h2>All Honey</h2>
            <span>
              {loading ? 'Loading…' : `${products.length} products`}
            </span>
          </div>

          {error && (
            <p className="shop-page__error" role="alert">
              {error}
            </p>
          )}

          {loading ? (
            <p>Loading products…</p>
          ) : (
            <div className="shop-page__grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Shop
