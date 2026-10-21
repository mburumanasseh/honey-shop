import Link from 'next/link'
import Hero from '../components/Hero'
import TrustStrip from '../components/TrustStrip'
import AddToCartButton from '../components/AddToCartButton'
import { listProducts, normalizeProduct } from '../lib/api'

export const metadata = {
  title: 'Home',
  description:
    'Mercy Gold Honey — premium natural Kenyan honey. Pure forest and wildflower honey delivered to your door.',
}

const VARIETIES = [
  {
    name: 'Light & Floral',
    tags: 'Delicate · Smooth · Refreshing',
    href: '/shop',
    image: '/benefits/card-everyday.jpg',
  },
  {
    name: 'Forest Honey',
    tags: 'Rich · Bold · Distinctive',
    href: '/shop',
    image: '/benefits/card-delicious.jpg',
  },
  {
    name: 'Raw Honey',
    tags: 'Pure · Natural · Unprocessed',
    href: '/shop',
    image: '/benefits/card-better.jpg',
  },
  {
    name: 'Comb Honey',
    tags: 'Natural · Fresh · Wholesome',
    href: '/shop',
    image: '/benefits/card-energy.jpg',
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
    <div className="home-v2">
      <Hero />
      <TrustStrip />

      <section className="home-varieties" aria-labelledby="our-honey-heading">
        <div className="container home-varieties__inner">
          <div className="home-varieties__intro">
            <span className="home-varieties__eyebrow">Our Honey</span>
            <h2 id="our-honey-heading">Nature&apos;s goodness in every jar.</h2>
            <p>
              From light and floral to rich and bold, find the perfect honey for
              your moments.
            </p>
            <Link href="/shop" className="btn-primary">
              Explore Our Honey <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="home-varieties__grid">
            {VARIETIES.map((v) => (
              <Link key={v.name} href={v.href} className="home-varieties__card">
                <div className="home-varieties__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.image} alt={v.name} />
                </div>
                <div className="home-varieties__body">
                  <h3>{v.name}</h3>
                  <p>{v.tags}</p>
                  <span className="home-varieties__arrow" aria-hidden>
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <p className="home-divider" aria-hidden>
        <span>Goodness from Kenya</span>
      </p>

      <section id="featured" className="featured-section">
        <div className="container">
          <div className="featured-section__header">
            <span>Our Selection</span>
            <h2>Featured Honey</h2>
            <p>
              Discover some of our finest honey, carefully selected for quality
              and natural flavor.
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
