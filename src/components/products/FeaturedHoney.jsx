import products from '../../data'
import ProductCard from './ProductCard'
import './FeaturedHoney.css'

function FeaturedHoney() {
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

        <div className="featured-honey__grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedHoney