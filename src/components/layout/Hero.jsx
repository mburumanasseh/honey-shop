import { Link } from 'react-router-dom'
import honeyJarImage from '../../assets/honeyjar.jpg'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="container hero__content">
        <div className="hero__text">
          <span className="hero__eyebrow">Pure. Natural. Kenyan.</span>

          <h1>Nature's sweetest gift, straight from the hive.</h1>

          <p>
            Discover naturally harvested honey made with care and delivered
            straight to your doorstep.
          </p>

          <div className="hero__actions">
            <Link to="/shop" className="hero__button hero__button--primary">
              Shop Honey
            </Link>

            <a
              href="#featured"
              className="hero__button hero__button--secondary"
            >
              Explore Our Honey
            </a>
          </div>
        </div>

        <div className="hero__image">
          <img src={honeyJarImage} alt="Jar of natural honey" />
        </div>
      </div>
    </section>
  )
}

export default Hero