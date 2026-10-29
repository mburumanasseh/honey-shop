import Link from 'next/link'
import Hero from '../components/Hero'
import TrustStrip from '../components/TrustStrip'
import AddToCartButton from '../components/AddToCartButton'
import { listProducts, normalizeProduct } from '../lib/api'

export const metadata = {
  title: 'Home',
  description:
    'Mercy Gold — Kenyan farm products marketplace. Honey, milk, and more from trusted farmers, secured by Mercy Gold.',
}

const CATEGORIES = [
  { slug: 'honey', label: 'Honey', blurb: 'Raw, floral, and forest varieties' },
  { slug: 'milk', label: 'Milk', blurb: 'Fresh dairy from local farms' },
  { slug: 'dairy', label: 'Dairy', blurb: 'Yoghurt, ghee, and more' },
  { slug: 'produce', label: 'Produce', blurb: 'Seasonal farm produce' },
]

export default async function HomePage() {
  let products = []
  let error = null
  try {
    const raw = await listProducts()
    products = (raw || []).map(normalizeProduct)
  } catch (e) {
    error = e.message || 'Could not load products'
  }

  const featured = products.slice(0, 6)

  return (
    <div>
      <Hero />
      <TrustStrip />

      <section className="home-categories">
        <div className="container">
          <div className="featured-section__header">
            <span>Browse</span>
            <h2>Shop by category</h2>
            <p>
              Mercy Gold is the middleman — we collect payment and release it to
              farmers after your order is delivered.
            </p>
          </div>
          <div className="home-categories__grid">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/shop?category=${c.slug}`}
                className="home-categories__card"
              >
                <h3>{c.label}</h3>
                <p>{c.blurb}</p>
                <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
          <p className="home-categories__sell muted">
            Are you a farmer?{' '}
            <Link href="/sell/register">Sell on Mercy Gold</Link>
          </p>
        </div>
      </section>

      <section id="featured" className="featured-section">
        <div className="container">
          <div className="featured-section__header">
            <span>Our Selection</span>
            <h2>Featured products</h2>
            <p>
              Hand-picked listings from Mercy Gold and approved farmers — honey
              first, with milk and more.
            </p>
          </div>

          {error && <p className="error">{error}</p>}
          {!error && featured.length === 0 && (
            <p className="muted">No products yet. Check back soon.</p>
          )}

          <div className="product-grid">
            {featured.map((p) => (
              <article className="product-card" key={p.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} />
                <div className="product-card__body">
                  {p.category && (
                    <span className="product-card__cat">{p.category}</span>
                  )}
                  <h2>
                    <Link href={`/products/${p.id}`}>{p.name}</Link>
                  </h2>
                  {p.size && <p className="muted">{p.size}</p>}
                  <p className="price">
                    KSh {Number(p.price).toLocaleString()}
                  </p>
                  <AddToCartButton product={p} />
                </div>
              </article>
            ))}
          </div>

          {featured.length > 0 && (
            <p className="featured-section__more">
              <Link href="/shop" className="btn-secondary">
                View all products →
              </Link>
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
