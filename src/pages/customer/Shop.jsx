import products from '../../data'
import ProductCard from '../../components/products/ProductCard'
import './Shop.css'

function Shop() {
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

            <span>{products.length} products</span>
          </div>

          <div className="shop-page__grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Shop