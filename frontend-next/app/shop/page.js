import Link from 'next/link'
import { listProducts, normalizeProduct } from '../../lib/api'
import AddToCartButton from '../../components/AddToCartButton'

export const metadata = {
  title: 'Shop',
  description:
    'Shop honey, milk, dairy, produce, and other farm products on Mercy Gold.',
}

/** Always respect ?category= — do not serve a cached “all products” page. */
export const dynamic = 'force-dynamic'
export const revalidate = 0

const CATEGORIES = [
  { slug: '', label: 'All' },
  { slug: 'honey', label: 'Honey' },
  { slug: 'milk', label: 'Milk' },
  { slug: 'dairy', label: 'Dairy' },
  { slug: 'produce', label: 'Produce' },
  { slug: 'other', label: 'Other' },
]

const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.filter((c) => c.slug).map((c) => [c.slug, c.label]),
)

function productCategory(p) {
  return String(p.category || 'honey').toLowerCase().trim()
}

export default async function ShopPage({ searchParams }) {
  const params = await searchParams
  const category = (params?.category || '').toString().toLowerCase().trim()
  const validCategory =
    category && CATEGORY_LABELS[category] ? category : category ? category : ''

  let products = []
  let error = null
  try {
    const raw = await listProducts(validCategory ? { category: validCategory } : {})
    products = (raw || []).map(normalizeProduct)
    // Client-safe guard: never show another category’s items under a filter
    if (validCategory) {
      products = products.filter((p) => productCategory(p) === validCategory)
    }
  } catch (e) {
    error = e.message || 'Could not load products'
  }

  const activeLabel = validCategory
    ? CATEGORY_LABELS[validCategory] || validCategory
    : 'All'
  const emptyMessage = validCategory
    ? `No stock yet in ${activeLabel}. Check back soon, or browse other categories.`
    : 'No products available yet. Check back soon.'

  return (
    <div className="container page">
      <span className="page-eyebrow">Marketplace</span>
      <h1>Shop</h1>
      <p className="muted">
        Farm products from Mercy Gold and approved farmers. Filter by category —
        each list only shows that type of product.
      </p>

      <div className="shop-filters" role="navigation" aria-label="Categories">
        {CATEGORIES.map((c) => {
          const href = c.slug ? `/shop?category=${c.slug}` : '/shop'
          const active = (c.slug || '') === validCategory
          return (
            <Link
              key={c.label}
              href={href}
              className={active ? 'shop-filter is-active' : 'shop-filter'}
              prefetch={false}
            >
              {c.label}
            </Link>
          )
        })}
      </div>

      {validCategory ? (
        <p className="shop-category-status">
          Showing: <strong>{activeLabel}</strong>
          {!error && products.length > 0
            ? ` · ${products.length} item${products.length === 1 ? '' : 's'}`
            : null}
        </p>
      ) : null}

      {error && <p className="error">{error}</p>}
      {!error && products.length === 0 && (
        <div className="shop-empty">
          <p className="shop-empty__title">No stock yet</p>
          <p className="muted">{emptyMessage}</p>
          {validCategory ? (
            <p>
              <Link href="/shop" className="btn-secondary">
                View all categories
              </Link>
            </p>
          ) : null}
        </div>
      )}

      {products.length > 0 && (
        <div className="product-grid">
          {products.map((p) => (
            <article className="product-card" key={p.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} />
              <div className="product-card__body">
                <span className="product-card__cat">{productCategory(p)}</span>
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
      )}
    </div>
  )
}
