import Link from 'next/link'
import Hero from '../components/Hero'
import TrustStrip from '../components/TrustStrip'
import AddToCartButton from '../components/AddToCartButton'
import { listProducts, normalizeProduct } from '../lib/api'

export const metadata = {
  title: 'Home',
  description:
    'Mercy Gold marketplace — honey, milk, and farm products from Kenyan farmers. Secure checkout; farmers paid after delivery.',
}

const CATEGORIES = [
  { slug: 'honey', label: 'Honey', blurb: 'Raw, floral, and forest varieties' },
  { slug: 'milk', label: 'Milk', blurb: 'Fresh dairy from local farms' },
  { slug: 'dairy', label: 'Dairy', blurb: 'Yoghurt, ghee, and more' },
  { slug: 'produce', label: 'Produce', blurb: 'Seasonal farm produce' },
]

const STEPS_BUYERS = [
  {
    title: 'Browse & order',
    text: 'Choose honey, milk, and other farm goods from Mercy Gold and approved farmers.',
  },
  {
    title: 'Pay Mercy Gold',
    text: 'Checkout with M-Pesa or cash arrangements — we hold the payment safely.',
  },
  {
    title: 'Receive your order',
    text: 'Once delivery is confirmed, we release payment to the farmer.',
  },
]

const STEPS_FARMERS = [
  {
    title: 'Register free',
    text: 'Create a seller account and complete your farm profile.',
  },
  {
    title: 'List products',
    text: 'Add honey, milk, and more — listings go live after Mercy Gold approval.',
  },
  {
    title: 'Deliver & get paid',
    text: 'Fulfill orders; we pay you after the customer receives their goods.',
  },
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
    <div className="home-market">
      <Hero />
      <TrustStrip />

      <section className="home-how">
        <div className="container">
          <div className="featured-section__header">
            <span>How Mercy Gold works</span>
            <h2>A marketplace you can trust</h2>
            <p>
              We connect buyers and farmers. Mercy Gold is the middleman —
              securing payment for both sides.
            </p>
          </div>
          <div className="home-how__grid">
            <div className="home-how__col">
              <h3>For buyers</h3>
              <ol className="home-how__steps">
                {STEPS_BUYERS.map((s, i) => (
                  <li key={s.title}>
                    <span className="home-how__num">{i + 1}</span>
                    <div>
                      <strong>{s.title}</strong>
                      <p>{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link href="/shop" className="btn-primary">
                Start shopping
              </Link>
            </div>
            <div className="home-how__col home-how__col--sell">
              <h3>For farmers</h3>
              <ol className="home-how__steps">
                {STEPS_FARMERS.map((s, i) => (
                  <li key={s.title}>
                    <span className="home-how__num">{i + 1}</span>
                    <div>
                      <strong>{s.title}</strong>
                      <p>{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link href="/sell/register" className="btn-primary">
                Register as a farmer
              </Link>
              <p className="home-how__login muted">
                Already selling? <Link href="/sell/login">Farmer login</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-categories">
        <div className="container">
          <div className="featured-section__header">
            <span>Browse</span>
            <h2>Shop by category</h2>
            <p>Honey first — with milk and other farm products growing on the platform.</p>
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
        </div>
      </section>

      <section id="featured" className="featured-section">
        <div className="container">
          <div className="featured-section__header">
            <span>Our Selection</span>
            <h2>Featured products</h2>
            <p>
              Approved listings from Mercy Gold and farmers across Kenya.
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

      <section className="home-farmer-cta">
        <div className="container home-farmer-cta__inner">
          <div>
            <span className="page-eyebrow">Sell on Mercy Gold</span>
            <h2>Are you a farmer?</h2>
            <p>
              List honey, milk, and other farm products. We approve listings,
              collect payment from buyers, and pay you after delivery is
              confirmed.
            </p>
          </div>
          <div className="home-farmer-cta__actions">
            <Link href="/sell/register" className="btn-primary">
              Register as a farmer
            </Link>
            <Link href="/sell/login" className="btn-secondary">
              Farmer login
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
