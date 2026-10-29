import Link from 'next/link'

export default function Hero() {
  return (
    <section className="hero-block">
      <div className="container hero-block__inner">
        <div className="hero-block__text">
          <span className="hero-block__eyebrow">Pure. Natural. Kenyan.</span>
          <h1>Farm goodness, secured by Mercy Gold.</h1>
          <p>
            Honey, milk, and more from trusted Kenyan farmers — we handle
            checkout and only pay farmers after delivery is confirmed.
          </p>
          <div className="hero-block__actions">
            <Link href="/shop" className="btn-primary">
              Shop products
            </Link>
            <Link href="/shop?category=honey" className="btn-secondary">
              Shop honey
            </Link>
          </div>
        </div>
        <div className="hero-block__image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/honeyjar.jpg" alt="Jar of natural Mercy Gold honey" />
        </div>
      </div>
    </section>
  )
}
