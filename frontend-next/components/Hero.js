import Link from 'next/link'

export default function Hero() {
  return (
    <section className="hero-block">
      <div className="container hero-block__inner">
        <div className="hero-block__text">
          <span className="hero-block__eyebrow">Mercy Gold Marketplace</span>
          <h1>Kenyan farm products, secured end to end.</h1>
          <p>
            Buy honey, milk, and more from trusted farmers. Mercy Gold handles
            checkout and only pays the farmer after your delivery is confirmed.
          </p>
          <div className="hero-block__actions">
            <Link href="/shop" className="btn-primary">
              Shop products
            </Link>
            <Link href="/sell/register" className="btn-secondary">
              Register as a farmer
            </Link>
          </div>
        </div>
        <div className="hero-block__image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero-farm-products.jpg" alt="Fresh Kenyan farm products — honey, milk, eggs, and produce" />
        </div>
      </div>
    </section>
  )
}
