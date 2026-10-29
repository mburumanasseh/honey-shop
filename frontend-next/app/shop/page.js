import Link from 'next/link'
import { listProducts, normalizeProduct } from '../../lib/api'
import AddToCartButton from '../../components/AddToCartButton'

export const metadata = {
  title: 'Shop',
  description:
    'Shop honey, milk, and farm products on Mercy Gold — secured checkout for Kenyan farmers and buyers.',
}

const CATEGORIES = [
  { slug: '', label: 'All' },
  { slug: 'honey', label: 'Honey' },
  { slug: 'milk', label: 'Milk' },
  { slug: 'dairy', label: 'Dairy' },
  { slug: 'produce', label: 'Produce' },
  { slug: 'other', label: 'Other' },
]

export default async function ShopPage({ searchParams }) {
  const params = await searchParams
  const category = (params?.category || '').toString().toLowerCase()

  let products = []
  let error = null
  try {
    const raw = await listProducts(category ? { category } : {})
    products = (raw || []).map(normalizeProduct)
  } catch (e) {
    error = e.message || 'Could not load products'
  }

  return (
    <div className="container page">
      <span className="page-eyebrow">Marketplace</span>
      <h1>Shop</h1>
      <p className="muted">
        Farm products from Mercy Gold and approved farmers. We collect payment
        and pay the farmer after delivery is confirmed.
      </p>

      <div className="shop-filters" role="navigation" aria-label="Categories">
        {CATEGORIES.map((c) => {
          const href = c.slug ? `/shop?category=${c.slug}` : '/shop'
          const active = (c.slug || '') === category
          return (
            <Link
              key={c.label}
              href={href}
              className={active ? 'shop-filter is-active' : 'shop-filter'}
            >
              {c.label}
            </Link>
          )
        })}
      </div>

      {error && <p className="error">{error}</p>}
      {!error && products.length === 0 && (
        <p className="muted">No products in this category yet.</p>
      )}

      <div className="product-grid">
        {products.map((p) => (
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
              {p.description && (
                <p className="muted">
                  {p.description.length > 100
                    ? `${p.description.slice(0, 100)}…`
                    : p.description}
                </p>
              )}
              {p.size && <p className="muted">{p.size}</p>}
              <p className="price">KSh {Number(p.price).toLocaleString()}</p>
              <AddToCartButton product={p} />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
