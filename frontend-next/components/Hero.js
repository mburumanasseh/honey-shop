import Link from 'next/link'
import { IconCart, IconLeaf } from './Icons'

export default function Hero() {
  return (
    <section className="hero-block hero-block--scenic">
      <div className="hero-block__bg" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/home/hero-bg.jpg"
          alt=""
        />
      </div>
      <div className="hero-block__shade" aria-hidden />
      <div className="container hero-block__inner">
        <div className="hero-block__text">
          <span className="hero-block__eyebrow">Pure. Natural. Kenyan.</span>
          <h1>
            Nature&apos;s sweetest gift,
            <br />
            <span className="hero-block__title-accent">straight from the hive.</span>
          </h1>
          <p>
            Discover naturally harvested honey made with care and delivered
            straight to your doorstep.
          </p>
          <div className="hero-block__actions">
            <Link href="/shop" className="btn-primary hero-block__btn">
              <IconCart size={18} />
              Shop Honey <span aria-hidden>→</span>
            </Link>
            <Link
              href="/benefits"
              className="btn-secondary hero-block__btn hero-block__btn--ghost"
            >
              <IconLeaf size={18} />
              Benefits of honey <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
        <p className="hero-block__script" aria-hidden>
          Real honey.
          <br />
          Real goodness.
        </p>
      </div>
    </section>
  )
}
